import mongoose from "mongoose";

const userMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    attachments: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const UserMessage =
  mongoose.models.UserMessage ||
  mongoose.model("UserMessage", userMessageSchema);

export default UserMessage;
