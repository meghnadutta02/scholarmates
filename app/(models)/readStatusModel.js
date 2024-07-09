import mongoose from "mongoose";

const readStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    groups: [
      {
        groupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
          required: true,
        },
        lastReadAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const ReadStatus =
  mongoose.models.ReadStatus || mongoose.model("ReadStatus", readStatusSchema);

export default ReadStatus;
