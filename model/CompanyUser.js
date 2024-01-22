import mongoose from "mongoose";

const companyuser = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    technology: {
      type: String,
      required: true,
      trim: true,
    },
    badges:{
      type : String,
      required : true,
      default:"Level 1",
      trim:true,
    },
    experience: {
      type: String,
      required: true,
      default: false,
    },
    city:{
      type:String,
      required:true,
    }
  },
  { timestamps: true },
);

export const CompanyUser = mongoose.model("CompanyUser", companyuser);

