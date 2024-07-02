import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

export async function GET(req, { params }) {
  try {
    await connect();

    const currentUser = await User.findById(params.findfriend);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    const excludedUsers = currentUser.connection;

    excludedUsers.push(params.findfriend);

    const users = await User.find({
      _id: { $nin: excludedUsers },
    });

    return NextResponse.json({ result: users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
