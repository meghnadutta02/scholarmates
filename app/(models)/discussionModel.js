import mongoose from "mongoose";
import Group from "./groupModel";
import User from "./userModel";
import GroupRequest from "./groupRequestModel";
import Message from "./messageModel";

const discussionSchema = new mongoose.Schema(
  {
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
    categories: { type: [String], default: [] },
    subcategories: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    likedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    dislikedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    dislikes: { type: Number, default: 0 },
    coverImage: { type: String, default: "" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    previousRank: { type: Number, default: 21 },
    notification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

discussionSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const discussion = this;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const group = await Group.findByIdAndDelete(discussion.groupId).session(
        session
      );

      if (group) {
        await GroupRequest.deleteMany({ groupId: discussion.groupId }).session(
          session
        );

        await Message.deleteMany({
          conversationId: discussion.groupId,
        }).session(session);

        await User.updateMany(
          { groupsJoined: discussion.groupId },
          { $pull: { groupsJoined: discussion.groupId } }
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        console.log("Discussion and associated data removed successfully.");
        next();
      } else {
        throw new Error("Group not found.");
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
);

const Discussion =
  mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);

export default Discussion;
