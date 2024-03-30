import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

//get matching user profiles
export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;

    const user = await User.findOne({ _id: id }).select("interestCategories");

    if (user.interestCategories.length > 0) {
      const interests = user.interestCategories;

      const users = await User.aggregate([
        { $match: { _id: { $ne: new ObjectId(id) } } },
        { $match: { interestCategories: { $in: interests } } },
      ]);

      if (users.length > 0)
        return NextResponse.json({ result: users }, { status: 200 });
      else
        return NextResponse.json(
          { result: [], message: "No matching user profiles" },
          { status: 200 }
        );
    }

    return NextResponse.json({ result: [] }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
