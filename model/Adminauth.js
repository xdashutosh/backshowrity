import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

 export const Adminauth =mongoose.model("HustleforworkAdmin", userSchema);

