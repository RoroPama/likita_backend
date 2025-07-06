import mongoose, { Schema } from "mongoose";
import { IEvent } from "../types/event";

const eventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["live", "coming"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      date: {
        type: String,
        required: true,
      },
      platform: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    liveUrl: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      required: true,
    },
    saves: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EventModel = mongoose.model<IEvent>("Event", eventSchema);

export default EventModel;
