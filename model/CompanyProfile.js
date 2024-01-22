import mongoose from "mongoose";

const companyprofile = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    country:{
      type : String,
      trim:true,
    },
    city: {
      type: String,
    },
    summary:{
        type:String,
    },
    premium:{
      type:Boolean,
      default:false,
    },
    mobile:{
        type:String,
    },
    name:{
      type:String,
      required:true
    },
    image: {
      publicId: String,
      url: String,
    },
  },
  { timestamps: true },
);

export const CompanyProfile = mongoose.model("companyprofile", companyprofile);

