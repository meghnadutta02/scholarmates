import mongoose from "mongoose";
import User from "./userModel.js";
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

        //by default the creator of the discussion is a moderator
      },
    ],
    description: String,
  },
  { timestamps: true }
);

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

export default Group;
