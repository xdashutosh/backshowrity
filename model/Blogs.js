import mongoose from "mongoose";

const blogs = new mongoose.Schema(
  {
    Heading1: {
      type: String,
      required: true,
      trim: true,
    },
    Desc1: {
      type: String,
      required: true,
      trim: true,
    },
    subHeading1:{
      type : String,
      required: true,
      trim: true,
    },
    subdesc1: {
      type: String,
      required: true,
      trim: true,
    },
    subHeading2:{
        type:String,
        required: true,
        trim: true,
    },
    subdesc2:{
      type:String,
      required: true,
      trim: true,
    },
    subHeading3:{
        type:String,
        required: true,
        trim: true,
    },
    subdesc3:{
        type:String,
        required: true,
        trim: true,
      },
      subHeading4:{
        type:String,
        required: true,
        trim: true,
    },
    subdesc4:{
        type:String,
        required: true,
        trim: true,
      },   
    image: {
      publicId: String,
      url: String,
    },
    

  },
  { timestamps: true },
);

export const Blogs = mongoose.model("blogs", blogs);

