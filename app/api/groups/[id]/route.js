import Group from "@/app/(models)/groupModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);

  try {
    const group = await Group.findById(id)
      .populate("participants")
      .populate("moderators")
      .populate("moderators", "_id name profilePic")
      .populate("participants", "_id name profilePic");

    if (!group) {
      return NextResponse.json({ result: "Group not found." }, { status: 404 });
    }

    const userId = session?.user?.db_id;
    const isUserModerator = group.moderators.some(
      (mod) => mod._id.toString() === userId
    );

    const groupDetails = {
      name: group.name,
      description: group.description,
      isPublic: group.isPublic,
      createdAt: group.createdAt,
      creator: group.moderators[0],
      participants: group.participants,
      moderators: group.moderators,
      isUserModerator,
    };

    return NextResponse.json({ groupDetails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
//Update group description and/or privacy
export async function PUT(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);

  const { description, isPublic } = await req.json();

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

    if (description !== undefined) {
      group.description = description;
    }

    if (isPublic !== undefined) {
      group.isPublic = isPublic;
    }

    await group.save();

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
