import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req) {
  try {
    const session = await getServerSession(options);
    console.log(session);
    const user_interests = await User.findOne({
      _id: session?.user?.db_id,
    });
    return NextResponse.json({ result: user_interests }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
