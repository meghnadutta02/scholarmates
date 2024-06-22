import mongoose from "mongoose";

<<<<<<< HEAD
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
=======
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
    title: { type: String, required: true },
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
    // chatLink: { type: String, required: true }, // Link to the chat page
>>>>>>> jr
  },
  { timestamps: true }
);

<<<<<<< HEAD
const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

export default Group;
=======
const Discussion =mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);

export default Discussion;
>>>>>>> jr
