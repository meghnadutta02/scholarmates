import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sendername: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // required: true
    },
    discussionId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Discussion"
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    message: {
      type: String,
      // required: true
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to delete notifications older than 10 days
notificationSchema.statics.deleteOldNotifications = async function () {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  await this.deleteMany({ timestamp: { $lt: tenDaysAgo }, isSeen: true });
};

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
export default Notification;
