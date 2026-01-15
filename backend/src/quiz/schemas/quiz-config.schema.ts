import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RawQuestionConfig } from '../../../util/data/quizConfig'; // Import your existing interfaces

@Schema({ timestamps: true })
export class QuizConfigDoc extends Document {
  @Prop({ unique: true, required: true })
  configName: string; // e.g., 'traya-hair-quiz-config'

  @Prop({ type: [{ type: Object }], required: true }) // Store array of question objects
  questions: RawQuestionConfig[]; 
}

export const QuizConfigSchema = SchemaFactory.createForClass(QuizConfigDoc);