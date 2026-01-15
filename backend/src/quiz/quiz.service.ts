import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizAnswer } from './schemas/quiz-answer.schema';
import { QuizConfigDoc } from './schemas/quiz-config.schema';
import { RAW_QUIZ_CONFIG } from 'util/data/quizConfig';

@Injectable()
export class QuizService implements OnApplicationBootstrap { 
  constructor(
    @InjectModel(QuizAnswer.name) private quizAnswerModel: Model<QuizAnswer>,
    @InjectModel(QuizConfigDoc.name) private quizConfigModel: Model<QuizConfigDoc>,
  ) {}
    // This method will run once when the application starts
  async onApplicationBootstrap() {
    // Check if quiz config already exists in DB
    const existingConfig = await this.quizConfigModel.findOne({ configName: 'traya-hair-quiz-config' });

    if (!existingConfig) {
      console.log('Seeding quiz configuration into MongoDB...');
      const newConfig = new this.quizConfigModel({
        configName: 'traya-hair-quiz-config',
        questions: RAW_QUIZ_CONFIG.questions, 
      });
      await newConfig.save();
      console.log('Quiz configuration seeded successfully.');
    } else {
      console.log('Quiz configuration already exists in MongoDB.');
    }
  }

  async saveQuizAnswers(answers: Record<string, string | { data: string; mimeType: string }>): Promise<QuizAnswer> {
    const newQuizAnswer = new this.quizAnswerModel({
      quizId: 'traya-hair-quiz', // A static ID for this specific quiz
      answers: answers,
    });
    return newQuizAnswer.save();
  }
  //  method to fetch quiz configuration from MongoDB
  async getQuizConfiguration(): Promise<QuizConfigDoc | null> {
    return this.quizConfigModel.findOne({ configName: 'traya-hair-quiz-config' }).exec();
  }
  //  method to retrieve Base64 image data
  async getQuizImage(quizAnswerId: string, questionId: string): Promise<{ data: string; mimeType: string } | null> {
    const quizAnswer = await this.quizAnswerModel.findById(quizAnswerId).exec();
    if (!quizAnswer) return null;

    const imageData = quizAnswer.answers[questionId];
    if (imageData && typeof imageData === 'object' && 'data' in imageData && 'mimeType' in imageData) {
      return imageData;
    }
    return null;
  }
}