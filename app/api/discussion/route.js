import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { ObjectId } from "mongodb";
import { interests } from "@/app/interests";
import Group from "@/app/(models)/groupModel";
import User from "@/app/(models)/userModel";
export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const data = await req.formData();
    const title = data.get("title");
    const type = data.get("type");
    const privacy = data.get("privacy");
    const content = data.get("content");
    const subcategories = data.getAll("subcategories");

    const discussion = await Discussion.create({
      title,
      type,
      privacy,
      content,
      creator: new ObjectId(session?.user?.db_id),

      subcategories,
    });

    const group = await Group.create({
      name: title,
      isPublic: privacy === "public",
      participants: [session?.user?.db_id],
      moderators: [session?.user?.db_id],
      description: `Group for discussion: ${title}`,
      type: type,
    });
    discussion.groupId = group._id;
    const user = await User.findById(session?.user?.db_id);
    user.groupsJoined.push(group._id);
    await user.save();
    await discussion.save();
    return NextResponse.json(
      { result: discussion },
      { status: 200 },
      { groupId: group._id }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession();


    const searchQuery = req.nextUrl.searchParams.get("searchQuery");
    const college = req.nextUrl.searchParams.get("college");
    const discussionType = req.nextUrl.searchParams.get("type");
    const category = req.nextUrl.searchParams.get("category");
    const subcategory = req.nextUrl.searchParams.get("subcategory");
    const offset = parseInt(req.nextUrl.offset) || 0;
    const limit = parseInt(req.nextUrl.limit) || 10;

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
      {
        $project: {
          "creatorData.interestCategories": 0,
          "creatorData.interestSubcategories": 0,
          "creatorData.email": 0,
          "creatorData.createdAt": 0,
          "creatorData.updatedAt": 0,
          "creatorData.__v": 0,
          "creatorData.dob": 0,
          "creatorData.degree": 0,
          "creatorData.department": 0,
          "creatorData.yearInCollege": 0,
          "creatorData.connection": 0,
          "creatorData.bio": 0,
          "creatorData.isAdmin": 0,
        },
      }
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
        const subcategories = interests
          .filter((interest) => categories.includes(interest.category))
          .flatMap((interest) => interest.subcategories);
        matchQuery.push({ subcategories: { $in: subcategories } });
      }
      if (subcategory) {
        const subcategories = subcategory.split(",");
        matchQuery.push({ subcategories: { $in: subcategories } });
      }
      aggregationPipeline.push({ $match: { $or: matchQuery } });
    }

    aggregationPipeline.push({ $match: { isActive: true } });

    // Apply pagination
    aggregationPipeline.push({ $skip: offset }, { $limit: limit });

    const discussions = await Discussion.aggregate(aggregationPipeline);

    return NextResponse.json({ result: discussions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
