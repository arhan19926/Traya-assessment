import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizController } from './quiz/quiz.controller';

@Module({
  imports: [],
  controllers: [AppController,QuizController],
  providers: [AppService],
})
export class AppModule {}
