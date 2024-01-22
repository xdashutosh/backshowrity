import mongoose from "mongoose";

const DeveloperAccount = new mongoose.Schema(
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

export const DeveloperAccounts = mongoose.model("DeveloperAccount", DeveloperAccount);

