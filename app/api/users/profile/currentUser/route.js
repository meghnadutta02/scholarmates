import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/app/config/db";

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(id).select(
      "-groupsJoined -createdAt -updatedAt -posts   -__v -isAdmin"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ result: user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
