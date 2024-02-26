import { Post } from "@/app/(models)/postModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

export async function GET() {
  await connect();
  const data = await Post.find({});
  // console.log(data);
  return NextResponse.json({ result: data });
}

export async function POST(req) {
  await connect();
  const data = await req.formData();
  const file = data.get("image");
  const content = data.get("content");
  console.log(data);

  if (!file) {
    return NextResponse.json({ error: "No files found", success: false });
  }

  const byteData = await file.arrayBuffer();
  const buffer = Buffer.from(byteData);
  const path = `public/${file.name}`;
  await writeFile(path, buffer);

  return NextResponse.json({
    result: "Post uploaded",
    success: true,
  });
}
