import connect from "@/app/config/db";

import { NextResponse } from "next/server";

import User from "@/app/(models)/userModel";

export async function GET(req) {
  try {
    await connect();

    const searchQuery = req.nextUrl.searchParams.get("searchQuery");

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
  } catch (error) {
    console.log("Error in getting myDiscussion data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
