import mongoose from "mongoose";

const groupRequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    toUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const groupRequest =
  mongoose.models.groupRequest ||
  mongoose.model("groupRequest", groupRequestSchema);
export default groupRequest;
