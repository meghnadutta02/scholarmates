import Discussion from "@/app/(models)/discussionModel";
import connect from "@/socketServer/db";

import { NextResponse } from "next/server";

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
