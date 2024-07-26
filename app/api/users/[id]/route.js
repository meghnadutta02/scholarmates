import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connect();

    const offset = parseInt(req.nextUrl.searchParams.get("offset")) || 0;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;

    const discussions = await Discussion.find({ creator: params.id })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ result: discussions }, { status: 200 });
  } catch (error) {
    console.log("Error in getting myDiscussion data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
