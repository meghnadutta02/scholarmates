import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Group from "@/app/(models)/groupModel";
import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const userId = session?.user?.db_id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Finding existing group IDs
    const existingGroups = await Group.find({
      _id: { $in: user.groupsJoined },
    }).select("_id name");

    const existingGroupIds = existingGroups.map((group) =>
      group._id.toString()
    );

    const updatedGroupsJoined = user.groupsJoined.filter((id) =>
      existingGroupIds.includes(id.toString())
    );

    if (updatedGroupsJoined.length !== user.groupsJoined.length) {
      user.groupsJoined = updatedGroupsJoined;
      await user.save();
    }

    return NextResponse.json({ groups: existingGroups }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
