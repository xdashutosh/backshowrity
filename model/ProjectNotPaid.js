import mongoose from "mongoose";

const ProjectNotPaid = new mongoose.Schema(
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
    rating:{
      type:String,
      default:0,
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

export const ProjectNotPaids = mongoose.model("ProjectNotPaid", ProjectNotPaid);

