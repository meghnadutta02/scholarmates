import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const { title, privacy, type, interestCategories, interestSubcategories } =
      await req.json();

    const discussion = await Discussion.create({
      title,
      privacy,
      type,
      creator: new ObjectId("65a00b05c4c6ed34bd3f9527"),
      interestCategories,
      interestSubcategories,
    });

    return NextResponse.json({ result: discussion }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
      { $unwind: "$creatorData" }
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
    if (category || subcategory) {
      let matchQuery = [];
      if (category) {
        const categories = category.split(",");
        matchQuery.push({ interestCategories: { $in: categories } });
      }
      if (subcategory) {
        const subcategories = subcategory.split(",");
        matchQuery.push({ interestSubcategories: { $in: subcategories } });
      }
      aggregationPipeline.push({ $match: { $or: matchQuery } });
    }
    aggregationPipeline.push({ $match: { isActive: true } });

    const discussions = await Discussion.aggregate(aggregationPipeline);

    return NextResponse.json({ result: discussions }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connect();

    const session = await getServerSession(options);
    const id = req.nextUrl.searchParams.get("id");

    const data = await req.json();

    const discussion = await Discussion.findOne({
      _id: id,
      creator: new ObjectId(session?.user?.db_id),
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return NextResponse.json({ result: updatedDiscussion }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = req.nextUrl.searchParams.get("id");

    const discussion = await Discussion.findOne({
      _id: id,
      creator: session?.user?.db_id,
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found or unauthorized" },
        { status: 404 }
      );
    }

    const deletedDiscussion = await Discussion.findByIdAndDelete(id);

    return NextResponse.json({ result: deletedDiscussion }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
