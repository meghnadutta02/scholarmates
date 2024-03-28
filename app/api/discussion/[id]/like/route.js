import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connect();
  const session = await getServerSession(options);
  const id = params.id;
  try {
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return NextResponse.json(
        { result: "Discussion not found." },
        { status: 500 }
      );
    }

    const userId = new ObjectId(session?.user?.db_id);
    const alreadyLikedIndex = discussion.likedBy.indexOf(userId);

    if (alreadyLikedIndex !== -1) {
      discussion.likes -= 1;
      discussion.likedBy.splice(alreadyLikedIndex, 1);
    } else {
      discussion.likes += 1;
      discussion.likedBy.push(userId);
    }

    await discussion.save();

    return NextResponse.json(
      { result: "Discussion like toggled successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
