import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req) {
  try {
    await connect();

    const searchQuery = req.nextUrl.searchParams.get("searchQuery");

    const results = await Discussion.aggregate([
      {
        $search: {
          index: "autocompleteDiscussions",
          autocomplete: {
            query: searchQuery,
            path: "title",
            tokenOrder: "sequential",
          },
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          title: 1,
        },
      },
    ]);

    // Return the results
    return NextResponse.json({ result: results }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
