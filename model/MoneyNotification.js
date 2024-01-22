import mongoose from "mongoose";

const MoneyNotification = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    IFSC: {
      type: String,
      required: true,
      trim: true,
    },
    AccountNumber:{
        type:String ,
        required:true,
        trim:true,
    },
    AccountName:{
        type:String,
        required:true,
        trim:true,
    }

   

  },
  { timestamps: true },
);

export const MoneyNotifications = mongoose.model("MoneyNotification", MoneyNotification);

