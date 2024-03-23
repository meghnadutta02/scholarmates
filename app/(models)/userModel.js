import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    proficiencies: [
      {
        type: String,
      },
    ],
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
    collegeName: {
      type: String,
      default: "",
    },
    yearInCollege: {
      type: Number,
      default: 1,
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

    connection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    interestCategories: [
      {
        type: String,
      },
    ],
    interestSubcategories: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
