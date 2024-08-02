const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    userEmail: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    userName: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const SupportRequest =
  mongoose.models.SupportRequest ||
  mongoose.model("SupportRequest", supportRequestSchema);

export default SupportRequest;
