import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define a type for image data stored as Base64
class ImageData {
  @Prop({ required: true })
  data: string; // Base64 string of the image
  
  @Prop({ required: true })
  mimeType: string; // e.g., 'image/jpeg', 'image/png'
}

@Schema({ timestamps: true })
export class QuizAnswer extends Document {
  @Prop({ required: true })
  quizId: string; // To identify which quiz this is for

  // Answers can be string or the new ImageData object
  @Prop({ type: Object, required: true })
  answers: Record<string, string | ImageData>; 

  @Prop()
  userId?: string; // Optional: if you have user authentication
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);