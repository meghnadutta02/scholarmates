import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    connection: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    requestPending: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    requestReceived: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    collegeName: {
      type: String,
      default: "",
    },
    yearInCollege: {
      type: Number,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    department: {
      type: String,
      default: "",
    },
    degree: {
      type: String,
      default: "",
    },
    groupsJoined: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
        },
      ],
      default: [],
    },
    interestCategories: {
      type: [String],
      default: [],
    },
    interestSubcategories: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
