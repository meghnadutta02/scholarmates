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
    connection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    interests: [interestSchema],
  },
  { timestamps: true }
);
// userSchema.index({ "interests.subcategories": 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
// User.collection.getIndexes().then((indexes) => {
//   console.log("Existing indexes for User model:", indexes);
// });
 export default User;
