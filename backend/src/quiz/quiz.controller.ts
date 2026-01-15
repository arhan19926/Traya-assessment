import { Controller, Get, Post, Body, Res, Param, HttpStatus } from '@nestjs/common';
import { QuizService } from './quiz.service'; // Import the service
import { type Response } from 'express'; // Import Response for direct manipulation

import * as rawQuizConfig from '../../util/data/quizConfig.json'; 

@Controller('api/quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService, // Inject the service
  ) {}

  @Get('questions')
  getQuizQuestions() {
    return rawQuizConfig;
  }

  @Post('submit')
  async submitQuizAnswers(@Body() answers: Record<string, string | { data: string; mimeType: string }>) {
    console.log('Received Quiz Answers for Mongo (BinData):', answers);
    const savedAnswer = await this.quizService.saveQuizAnswers(answers); 
    return { message: 'Answers submitted successfully!', id: savedAnswer._id };
  }

  // New endpoint to serve images stored as Base64 BinData
  @Get('image/:quizAnswerId/:questionId')
  async serveQuizImage(
    @Param('quizAnswerId') quizAnswerId: string,
    @Param('questionId') questionId: string,
    @Res() res: Response // Use @Res() to directly control the response
  ) {
    try {
      const imageData = await this.quizService.getQuizImage(quizAnswerId, questionId);
      if (!imageData) {
        return res.status(HttpStatus.NOT_FOUND).send('Image not found or invalid question ID.');
      }

      // Extract Base64 data and mimeType
      const base64Data = imageData.data;
      const mimeType = imageData.mimeType;

      // Ensure data URI prefix is removed before converting to buffer
      const base64Image = base64Data.split(';base64,').pop();
      if (!base64Image) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Invalid image data format.');
      }

      const imageBuffer = Buffer.from(base64Image, 'base64');

      res.set({
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length,
        'Cache-Control': 'public, max-age=31536000' // Cache images for a year
      });
      res.send(imageBuffer);

    } catch (error) {
      console.error('Error serving image from MongoDB:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error retrieving image.');
    }
  }

}