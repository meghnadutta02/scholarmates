import connect from "@/app/config/db";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import User from "@/app/(models)/userModel";

export async function GET(req) {
  try {
    await connect();

    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    const id = req.nextUrl.searchParams.get("id");
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
      {
        $match: {
          _id: { $ne: new ObjectId(id) },
          $and: [
            { email: { $ne: "user-does-not-exist" } },
            { name: { $ne: "[deleted]" } },
          ],
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
