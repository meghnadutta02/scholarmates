import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req) {
  try {
    await connect();

    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const offset = parseInt(req.nextUrl.searchParams.get("offset")) || 0;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;
    let totalDiscussions = 0;

    if (offset === 0) {
      totalDiscussions = await Discussion.countDocuments({
        creator: session?.user?.db_id,
      });
    }

    const myDiscussion = await Discussion.find({
      creator: session?.user?.db_id,
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    return NextResponse.json(
      { result: myDiscussion, total: totalDiscussions },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting myDiscussion data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
