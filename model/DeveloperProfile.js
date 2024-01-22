import mongoose from "mongoose";

const developerprofile = new mongoose.Schema(
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
    skill:{
        type:[String],

    },
    mobile:{
        type:String,
    },
    badges:{
      type:String,
      default:"Bronze",
    },
    rating:{
      type:Number,
      default:0,
    },
    name:{
      type:String,
      required:true
    }, 
    experience:{
      type:String,
      required:true
    },
    linkdin:{
      type:String,

    },
    website:{
      type:String,

    },
    jobtitle:{
      type:String,
      required:true
    },

    imageBanner: {
      publicId: String,
      url: String,
    },
    image: {
      publicId: String,
      url: String,
    },
   
  },
  { timestamps: true },
);

export const DeveloperProfile = mongoose.model("DeveloperProfile", developerprofile);

