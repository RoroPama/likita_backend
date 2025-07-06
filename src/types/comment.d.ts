import mongoose, { Document } from "mongoose";
import { IPopulatedUser } from "./user";
export interface IComment extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentPopulated extends Omit<IComment, "userId"> {
  userId: IPopulatedUser;
}
