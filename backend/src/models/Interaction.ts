import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export type InteractionType = "view" | "save" | "enroll";

export interface IInteraction extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  type: InteractionType;
  createdAt: Date;
  updatedAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    type: {
      type: String,
      enum: ["view", "save", "enroll"],
      required: true,
    },
  },
  { timestamps: true }
);

interactionSchema.index({ user: 1, course: 1, type: 1 });

export const Interaction: Model<IInteraction> =
  mongoose.models.Interaction ||
  mongoose.model<IInteraction>("Interaction", interactionSchema);
