import Group from "@/app/(models)/groupModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);
  const userId = params.userId;
  const { action } = await req.json();

  try {
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ result: "Group not found." }, { status: 404 });
    }

    const creatorId = group.moderators[0].toString();
    if (session?.user?.db_id !== creatorId) {
      return NextResponse.json(
        { result: "Only the creator can make/remove moderators." },
        { status: 403 }
      );
    }

    if (action === "make" && !group.moderators.includes(userId)) {
      group.moderators.push(userId);
    } else if (action === "remove") {
      group.moderators = group.moderators.filter(
        (id) => id.toString() !== userId
      );
    } else {
      return NextResponse.json({ result: "Invalid action." }, { status: 400 });
    }

    await group.save();

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Delete a user from a group
export async function DELETE(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);

  const { userId } = await req.json();

  try {
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ result: "Group not found." }, { status: 404 });
    }

    const moderatorId = new ObjectId(session?.user?.db_id);
    if (!group.moderators.includes(moderatorId)) {
      return NextResponse.json(
        { result: "User is not a moderator." },
        { status: 403 }
      );
    }

    group.participants = group.participants.filter(
      (id) => id.toString() !== userId
    );

    await group.save();

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
