import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModule } from './quiz/quiz.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    // Configure Mongoose to connect to MongoDB Atlas
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      // Add connection options here if needed (e.g., directConnection: true)
    }),
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}