import mongoose from "mongoose";
import User from "./userModel.js";
import GroupRequest from "./groupRequestModel";
import Message from "./messageModel";
import Discussion from "./discussionModel";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    description: String,
    discussionId: { type: String, required: true },
  },
  { timestamps: true }
);

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

export default Group;
