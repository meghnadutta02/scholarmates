import { Post } from "@/app/(models)/postModel";
import { User } from "@/app/(models)/userModel";
import connect from "@/socketServer/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { postObject } from "@/app/config/s3";

export async function GET() {
  try {
    await connect();

    // Determine the number of posts to skip based on the 'page' query parameter
    // const page = parseInt(query.page) || 1;
    // const pageSize = 5;
    // const skip = (page - 1) * pageSize;

    // Fetch posts, sorting by createdAt field in descending order, and skipping the appropriate number of posts
    const data = await Post.find({})
                           .sort({ createdAt: -1 })
                           .limit(10);

    return NextResponse.json({ result: data });
  } catch (error) {
    console.error("Error occurred while fetching posts:", error);
    return NextResponse.json({
      error: "Error occurred while fetching posts",
      success: false,
    });
  }
}

export async function POST(req, { params }) {
  await connect();
  const userId = params.post;
  const data = await req.formData();
  const description = data.get("description");
  const caption = data.get("caption");
  const file = data.get("image");

  if (!file) {
    return NextResponse.json({ error: "No files found", success: false });
  }

  try {
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `public/${file.name}`;
    const uploadedImage = await postObject(path, buffer);

    const newPost = await Post.create({
      description: description,
      image: uploadedImage,
      caption: caption,
      userId: userId,
    });

    if (newPost) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { post: newPost._id } },
        { new: true }
      );
      console.log(updatedUser);
    }


    return NextResponse.json({
      result: "Post uploaded",
      success: true,
    });
  } catch (error) {
    console.error("Error occurred while uploading post:", error);
    return NextResponse.json({
      error: "Error occurred while uploading post",
      success: false,
    });
  }
}
