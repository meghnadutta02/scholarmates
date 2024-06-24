import mongoose from "mongoose";
import Group from "./groupModel";
import User from "./userModel";
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
    previousRankChange: { type: String, default: "increase" },
    previousRankJump: { type: Number, default: 0 },
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
    coverImage: { type: String, default: "" },
    //chat group
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

    previousRank: {
      type: Number,
      default: 21,
    },
  },
  { timestamps: true }
);

const Discussion =
  mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);

export default Discussion;
