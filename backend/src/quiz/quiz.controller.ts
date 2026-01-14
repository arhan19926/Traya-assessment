    // backend/src/quiz/quiz.controller.ts (example new file)
    import { Controller, Get } from '@nestjs/common';
    import * as rawQuizConfig from '../../util/data/quizConfig.json'; 

    @Controller('api/quiz')
    export class QuizController {
      @Get('questions')
      getQuizQuestions() {
        // In a real scenario, we would load this from a database or a proper config service.
        // For now, we're serving the extracted JSON directly.
        return rawQuizConfig;
      }
    }