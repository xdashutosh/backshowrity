import mongoose from "mongoose";

const HireAccount = new mongoose.Schema(
  {
    Projectid: {
      type: String,
      required: true,
      trim: true,
    },
    userId:{
      type:String,
      required:true,
      trim:true,
    },
    Hireid:{
      type:String,
      required:true,
      trim:true,
    },
    orderIdintial:{
      type:String,
      
      trim:true,
    },
    orderIdfinal:{
        type:String,
        
        trim:true,
      },
    amountinitial:{
        type:String,
        
        trim:true,
    },
    amountfinal:{
        type:String,
        
        trim:true,
    },
    ProjectSummary:{
      type:String,
      
    },
       
     
  },
  { timestamps: true },
);

export const HireAccounts = mongoose.model("HireAccount", HireAccount);

