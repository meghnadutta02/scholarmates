
import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

const postSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,required:true},
  // description: { type: String },
  // image:[{type:String,required:true}],
  // caption:{type:String},
  // likes: { type: Number, default: 0 },
  // Comment:[commentSchema]
},{timestamps:true});

// export const Post=mongoose.model('posts',postSchema);
export const Post =mongoose.models.posts || mongoose.model("posts", postSchema);
