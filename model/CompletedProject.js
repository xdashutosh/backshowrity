import mongoose from "mongoose";

const CompletedProject = new mongoose.Schema(
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
    orderId:{
      type:String,
      required:true,
      trim:true,
    },
    amount:{
        type:String,
        required:true,
        trim:true,
    },
    successful:{
      type:String,
      default:false,
    },
    ProjectSummary:{
      type:String,
      
    },
        ProjectMoney:{
          type:String,
          required:true,
          trim:true,
      },
      estimateTime:{
        type:String,
        required:true,
        trim:true,
  }
  },
  { timestamps: true },
);

export const CompletedProjects = mongoose.model("CompletedProject", CompletedProject);

