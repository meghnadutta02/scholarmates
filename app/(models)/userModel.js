import mongoose from "mongoose";
import Discussion from "./discussionModel";
import GroupRequest from "./groupRequestModel";
import Notification from "./notificationModel";
import Request from "./requestModel";
import Group from "./groupModel";
import { v4 as uuidv4 } from "uuid";

import SupportRequest from "./supportRequestModel";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    connection: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    requestPending: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    requestReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    collegeName: { type: String, default: "" },
    yearInCollege: { type: Number, default: null },
    dob: { type: Date, default: null },
    department: { type: String, default: "" },
    degree: { type: String, default: "" },
    groupsJoined: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: [] },
    ],
    interestCategories: { type: [String], default: [] },
    interestSubcategories: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text" }, { name: "SearchIndex" });

userSchema.statics.clearUserDocument = async function (userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await this.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found.");
    }
    const randomUUID = uuidv4();
    const updatedEmail = `user-does-not-exist-${randomUUID}`;
    await this.findByIdAndUpdate(userId, {
      $set: {
        name: "[deleted]",
        bio: "",
        profilePic: "/pfp.png",
        email: updatedEmail,
        isAdmin: false,
        connection: [],
        requestPending: [],
        requestReceived: [],
        collegeName: "",
        yearInCollege: null,
        dob: null,
        department: "",
        degree: "",
        groupsJoined: [],
        interestCategories: [],
        interestSubcategories: [],
      },
    }).session(session);

    await Discussion.deleteMany({ creator: userId }).session(session);
    await GroupRequest.deleteMany({ fromUser: userId }).session(session);
    await GroupRequest.updateMany(
      { toUsers: userId },
      { $pull: { toUsers: userId } }
    ).session(session);
    await Notification.deleteMany({
      $or: [{ senderId: userId }, { recipientId: userId }],
    }).session(session);
    await SupportRequest.deleteMany({ userEmail: user.email }).session(session);

    await User.updateMany(
      { connection: userId },
      { $pull: { connection: userId } }
    ).session(session);
    await Group.updateMany(
      { participants: userId },
      { $pull: { participants: userId } }
    ).session(session);

    await Discussion.updateMany(
      { likedBy: userId },
      {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      }
    ).session(session);
    await Discussion.updateMany(
      { dislikedBy: userId },
      {
        $pull: { dislikedBy: userId },
        $inc: { dislikes: -1 },
      }
    ).session(session);
    await Request.deleteMany({
      $or: [{ requestTo: userId }, { participants: userId }, { user: userId }],
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    console.log(
      "User document cleared successfully, except messages and userMessages."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error clearing user document:", error);
    throw error;
  }
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
