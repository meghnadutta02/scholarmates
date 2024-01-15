import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

//get all users
export async function GET(req) {
  try {
    await connect();

    const users = await User.find({});

    return NextResponse.json({ result: users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
