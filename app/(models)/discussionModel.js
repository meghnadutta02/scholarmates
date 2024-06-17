import mongoose from "mongoose";
import Group from "./groupModel";

const discussionSchema = new mongoose.Schema(
  {
    privacy: { type: String, enum: ["private", "public"], required: true },

    type: {
      type: String,
      enum: [
        "general",
        "urgent",
        "announcement",
        "collaboration",
        "event",
        "support",
      ],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    categories: {
      type: [String],
      default: [],
    },
    subcategories: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    dislikedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    attachments: {
      type: [String],
      default: [],
    },
    //chat group
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true }
);

const Discussion =
  mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);

export default Discussion;
