import Discussion from "@/app/(models)/discussionModel";

import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import User from "@/app/(models)/userModel";
export async function GET(req) {
  try {
    await connect();

    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    if (searchQuery) {
      const results = await User.aggregate([
        {
          $search: {
            index: "autocompleteUsers",
            autocomplete: {
              query: searchQuery,
              path: "name",
              tokenOrder: "sequential",
            },
          },
        },
        { $limit: 10 },
        {
          $project: {
            name: 1,
            profilePic: 1,
          },
        },
      ]);

      return NextResponse.json({ result: results }, { status: 200 });
    } else {
      const session = await getServerSession(options);
      if (!session) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const myDiscussion = await Discussion.find({
        creator: session?.user?.db_id,
      }).sort({ createdAt: -1 });

      return NextResponse.json({ result: myDiscussion }, { status: 200 });
    }
  } catch (error) {
    console.log("Error in getting myDiscussion data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
