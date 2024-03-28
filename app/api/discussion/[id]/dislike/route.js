import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
export async function PUT(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);
  try {
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return NextResponse.json(
        { result: "Discussion not found." },
        { status: 500 }
      );
    }

    const userId = new ObjectId(session?.user?.db_id);
    const alreadyDislikedIndex = discussion.dislikedBy.indexOf(userId);
    if (alreadyDislikedIndex !== -1) {
      discussion.dislikes -= 1;
      discussion.dislikedBy.splice(alreadyDislikedIndex, 1);
    } else {
      discussion.dislikes += 1;
      discussion.dislikedBy.push(userId);
    }

    await discussion.save();

    return NextResponse.json(
      { result: "Discussion dislike toggled successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
