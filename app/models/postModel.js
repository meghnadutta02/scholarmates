import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema({
  content: String,
  likes: String,
});

export const Post =
  mongoose.models.posts || mongoose.model("posts", postSchema);
