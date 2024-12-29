import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      maxLength: "6"
    },
    otpExpires: {
      type: Date,
    },
    layout: [
      {
        id: { type: String, required: true },
        position: { type: Number, required: true, min: 0 },
        snippet: {
          title: { type: String },
          thumbnails: {
            maxres: { url: { type: String } },
            medium: { url: { type: String } }, 
            default: { url: { type: String } }
          }
        }
      }
    ],
  },
  { timestamps: true }
);
const Consumer = mongoose.model("Consumer", userSchema);
export default Consumer;
