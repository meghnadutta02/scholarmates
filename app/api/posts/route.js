import { Post } from "@/app/(models)/postModel";
import { User } from "@/app/(models)/userModel";
import connect from "@/app/config/db";
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


