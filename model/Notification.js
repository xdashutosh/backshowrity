import mongoose from "mongoose";

const notification = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    msg:{
      type : String,
      trim:true,
    }
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notification);

