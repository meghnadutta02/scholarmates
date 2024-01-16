import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;

    const user = await User.findOne({ _id: id }).select("interests");
    if (user.interests.length > 0) {
      const interests = user.interests.map((i) => i.categories);
      const users = await User.aggregate([
        { $match: { _id: { $ne: new ObjectId(id) } } },
        // { $unwind: "$interests" },
        { $match: { "interests.categories": { $in: interests } } },
        // { $group: { _id: "$_id" } },
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
