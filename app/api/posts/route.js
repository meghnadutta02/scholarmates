import { connection } from "@/app/config/db";
import { Post } from "@/app/models/postModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(connection);

  const data = await Post.find({});
  // console.log(data);
  return NextResponse.json({ result: data });
}
