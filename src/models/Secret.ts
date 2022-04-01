import mongoose from "mongoose";

const secretSchema = new mongoose.Schema(
  {
    secretText: {
      type: { iv: String, content: String },
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Secret = mongoose.model("Secret", secretSchema);

export { Secret };
