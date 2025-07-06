import mongoose, { Document, Schema } from "mongoose";
import { IComment } from "../types/comment";

const commentSchema = new Schema<IComment>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
commentSchema.index({ eventId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
