//get groups for a user

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
    const userId = "65fe90a820c7bb4be1dd9cb8";
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const groups = await Group.find({ _id: { $in: user.groupsJoined } });
    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
