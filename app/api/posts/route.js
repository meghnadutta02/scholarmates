import { Post } from "@/app/(models)/postModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  const data = await Post.find({});
  // console.log(data);
  return NextResponse.json({ result: data });
}
