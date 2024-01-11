import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  subcategories: {
    type: [String],
    default: [],
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    },
    department: {
      type: String,
      default: "",
    },
    degree: {
      type: String,
      default: "",
    },
    interests: {
      type: [interestSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
