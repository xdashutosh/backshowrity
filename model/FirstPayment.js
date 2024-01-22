import mongoose from "mongoose";

const FirstPayemnt = new mongoose.Schema(
  {
    FirstPay: {
      type: String,
      required: true,
      trim: true,
    },
    
    

  },
  { timestamps: true },
);

export const FirstPayment = mongoose.model("FirstPayemnt", FirstPayemnt);

