import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

export const Post =
  mongoose.model("posts", postSchema) || mongoose.models.posts;
