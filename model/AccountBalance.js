import mongoose from "mongoose";

const AccountBalance = new mongoose.Schema(
  {
   
    userId:{
      type:String,
      required:true,
      trim:true,
    },
    Balance:{
      type:String,
      required:true,
      trim:true,
    }
  },
  { timestamps: true },
);

export const AccountBalances = mongoose.model("AccountBalance", AccountBalance);

