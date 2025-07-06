import mongoose from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface IPopulatedUser {
  _id: Types.ObjectId;
  username: string;
}
