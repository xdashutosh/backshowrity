import mongoose from "mongoose";

const projects = new mongoose.Schema(
  {
    companyName:{
    type : String,
    required:true,
    trim:true,
    },
    technology: {
      type: String,
      required: true,
      trim: true,
    },
    estimateTime: {
      type: String,
      required: true,
      trim: true,
    },
    level:{
     type:String ,
     required:true,
     trim:true,
    },
    TimeOfPosting:{
        type: Date, // Use the Date type to store timestamps
        required: true,
        default: Date.now, 
    },
    appliedUser: {
        type: [String], // This defines an array of strings
        required: true,
        default: [],
    },
    creatorId:{
      type:String,
      required:true,
    },
    ProjectSummary:{
      type:String,
      required:true,
    },
    ProjectMoney:{
      type:String,
      required:true,
    }
    
    
  },
  { timestamps: true },
);

export const Projects = mongoose.model("Projects", projects);

