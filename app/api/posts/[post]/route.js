import { Post } from "@/app/(models)/postModel";
import {User} from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import {postObject} from "@/app/config/s3"
export async function GET() {
  await connect();
  const data = await Post.find({});
  // console.log(data);
  return NextResponse.json({ result: data });
}

export async function POST(req,{params}) {
  await connect();
  const userId=params.post;
  const data = await req.formData();
  const description=data.get("description");
  const caption=data.get("caption");
  const file = data.get("image");
  
  
  console.log(userId);
  
  if (!file) {
    return NextResponse.json({ error: "No files found", success: false });
  }

// ===========UPLOAD IMAGE IN S3 BUCKET=============

  const byteData = await file.arrayBuffer();
  const buffer = Buffer.from(byteData);
  const path = `public/${file.name}`;
  const get=await postObject(path,buffer);
  console.log(get);

  // =========database==============

  const newPost=await Post({
    description:description,
    image:get,
    caption:caption,
    userId:userId
  }).save();
  if(newPost){
    console.log(newPost);
    const updatauser=await User.findById(userId);
    console.log(updatauser);
    if(updatauser){
      updatauser.post.push(newPost._id)
      await updatauser.save(); 
    }

  }
  return NextResponse.json({
    result: "Post uploaded",
    success: true,
  });
}
