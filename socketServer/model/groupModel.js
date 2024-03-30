import mongoose from "mongoose";

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
  },
  { timestamps: true }
);

const Discussion =mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);

export default Discussion;
