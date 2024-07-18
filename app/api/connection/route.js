import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const userId = session?.user?.db_id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const connections = await User.find(
      { _id: { $in: user.connection } },
      { name: 1, id: 1, profilePic: 1, connection: 1 }
    );

    return NextResponse.json({ connections }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
