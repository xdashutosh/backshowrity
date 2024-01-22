import mongoose from "mongoose";
const pushmodelschema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Pushmodel = mongoose.model("HustleforworkToken", pushmodelschema);
