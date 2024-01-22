import mongoose from "mongoose";

const admin = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true },
);

export const Admin = mongoose.model("admin", admin);

