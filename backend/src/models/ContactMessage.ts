import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);
