import mongoose from "mongoose";

const projectManagement = new mongoose.Schema(
  {
    ProjectId: {
      type: String,
      required: true,
      trim: true,
    },
    startingTime: {
      type: String,
      required: true,
      trim: true,
    },
    TimeOfCompletion:{
        type: Date, // Use the Date type to store timestamps
        required: true,
        default: Date.now,
    },
    Paymentstatus: {
        type: String, // This defines an array of strings
        required: true,
        default: "pending",
    },
    UserId: {
        type: String,
        required: true,
        trim: true,
      }
    
  },
  { timestamps: true },
);

export const ProjectManagement = mongoose.model("ProjectManagement", projectManagement);

