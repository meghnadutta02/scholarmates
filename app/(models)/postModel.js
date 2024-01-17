import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

export const Post =
  mongoose.models.posts || mongoose.model("posts", postSchema);