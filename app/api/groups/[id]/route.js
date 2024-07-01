import Group from "@/app/(models)/groupModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
//Update group description and/or privacy
export async function PUT(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);

  const { description, isPublic, name } = await req.json();

  try {
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ result: "Group not found." }, { status: 404 });
    }

    const userId = session?.user?.db_id;
    if (!group.moderators.includes(userId)) {
      return NextResponse.json(
        { result: "User is not a moderator." },
        { status: 403 }
      );
    }

    if (description !== undefined && group.description !== description) {
      group.description = description;
    }

    if (isPublic !== undefined && group.isPublic !== isPublic) {
      group.isPublic = isPublic;
    }
    if (name !== undefined && group.name !== name) {
      group.name = name;
    }

    await group.save();

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);
  const userId = session?.user?.db_id;

  try {
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ result: "Group not found." }, { status: 404 });
    }

    // Check if the user is a participant or moderator
    const isParticipant = group.participants.includes(userId);
    const isModerator = group.moderators.includes(userId);

    if (!isParticipant) {
      return NextResponse.json(
        { result: "User is not a participant in this group." },
        { status: 403 }
      );
    }

    group.participants = group.participants.filter(
      (participantId) => participantId.toString() !== userId
    );

    if (isModerator) {
      group.moderators = group.moderators.filter(
        (moderatorId) => moderatorId.toString() !== userId
      );
    }

    await group.save();

    const user = await User.findById(userId);
    user.groupsJoined = user.groupsJoined.filter(
      (groupId) => groupId.toString() !== id
    );
    await user.save();

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
