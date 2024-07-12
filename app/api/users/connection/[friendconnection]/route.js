import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

//get all users
export async function GET(req, { params }) {
  try {
    await connect();

    const users = await User.findById(params.friendconnection);
    if (users) {
      const userDetails = await Promise.all(
        users.connection.map(async (e) => {
          const user = await User.findById(e);
          return user;
        })
      );

      return NextResponse.json({ result: userDetails }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
