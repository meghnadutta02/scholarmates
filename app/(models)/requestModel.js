import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    notificationRecipt: {
      type: Boolean,
      default: false,
    },
    notificationSend: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processed: {
      type: Boolean,
      default: false,
    },
    sendnotificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notifications",
    },
    recepitnotificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notifications",
    },
  },
  { timestamps: true }
);

const Request =
  mongoose.models.request || mongoose.model("request", requestSchema);

export default Request;
