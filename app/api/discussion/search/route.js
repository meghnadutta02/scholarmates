import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);

    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    const college = req.nextUrl.searchParams.get("college");
    const discussionType = req.nextUrl.searchParams.get("type");
    const category = req.nextUrl.searchParams.get("category");
    const subcategory = req.nextUrl.searchParams.get("subcategory");
    let aggregationPipeline = [];

    if (searchQuery) {
      const atlasSearchQuery = {
        $search: {
          index: "searchDiscussions",
          text: {
            query: searchQuery,
            path: {
              wildcard: "*",
            },
            fuzzy: {},
          },
        },
      };

      aggregationPipeline.push(atlasSearchQuery);
    }
    aggregationPipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creatorData",
        },
      },
      { $unwind: "$creatorData" },

      { $project: { creatorData: 0 } }
    );

    if (college) {
      aggregationPipeline.push({
        $match: { "creatorData.collegeName": session?.user?.collegeName },
      });
    }
    if (discussionType) {
      const types = discussionType.split(",");
      aggregationPipeline.push({ $match: { type: { $in: types } } });
    }
    if (category) {
      const categories = category.split(",");
      aggregationPipeline.push({ $match: { categories: { $in: categories } } });
    }
    if (subcategory) {
      const subcategories = subcategory.split(",");
      aggregationPipeline.push({
        $match: { subcategories: { $in: subcategories } },
      });
    }
    aggregationPipeline.push({ $match: { isActive: true } }, { $limit: 5 });

    const discussions = await Discussion.aggregate(aggregationPipeline);

    return NextResponse.json({ result: discussions }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
