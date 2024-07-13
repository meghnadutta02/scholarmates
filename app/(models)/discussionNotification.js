import mongoose from "mongoose";

const discussionNotificationSchema = new mongoose.Schema(
  {
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion" },
    content: { type: String, required: true, default: "" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    connection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
discussionNotificationSchema.index({ discussionId: 1 });
const DiscussionNotification =
  mongoose.models.DiscussionNotification ||
  mongoose.model("DiscussionNotification", discussionNotificationSchema);

export default DiscussionNotification;
