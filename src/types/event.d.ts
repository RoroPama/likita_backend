import mongoose from "mongoose";

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  status: "live" | "coming";
  imageUrl: string;
  title: string;
  details: {
    date: string;
    platform: string;
  };
  description: string;
  liveUrl: string;
  likes: string[];
  saves: string[];
}
