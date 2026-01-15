import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizAnswer } from './schemas/quiz-answer.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizAnswer.name) private quizAnswerModel: Model<QuizAnswer>,
  ) {}

  async saveQuizAnswers(answers: Record<string, string | { data: string; mimeType: string }>): Promise<QuizAnswer> {
    const newQuizAnswer = new this.quizAnswerModel({
      quizId: 'traya-hair-quiz', // A static ID for this specific quiz
      answers: answers,
    });
    return newQuizAnswer.save();
  }

  // New method to retrieve Base64 image data
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