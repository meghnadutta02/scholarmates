
import mongoose from "mongoose";



const postkaroSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,required:true},
  // description: { type: String },
  // image:[{type:String,required:true}],
  // caption:{type:String},
  // likes: { type: Number, default: 0 },
  // Comment:[commentSchema]
},{timestamps:true});

// export const Post=mongoose.model('posts',postSchema);
export const Postkaro =mongoose.models.postskaro || mongoose.model("postskaro", postkaroSchema);
