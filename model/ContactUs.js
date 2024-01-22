import mongoose from "mongoose";

const contactus = new mongoose.Schema(
  {
    email: {
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

export const CONTACTUS = mongoose.model("CONTACTUS", contactus);

