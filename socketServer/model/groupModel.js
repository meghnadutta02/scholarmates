import mongoose from "mongoose";

function moderatorLimit(val) {
  return val.length <= 5;
}
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
    moderators: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [moderatorLimit, "{PATH} exceeds the limit of 5"],
    },
    description: String,
  },
  { timestamps: true }
);

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

export default Group;
