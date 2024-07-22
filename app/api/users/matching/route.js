import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import { ObjectId } from "mongodb";
//get matching user profiles
export async function GET(req) {
  try {
    await connect();
    const id = req.nextUrl.searchParams.get("id");

    const user = await User.findById(id).select(
      "interestCategories connection requestPending requestReceived"
    );

    if (user.interestCategories.length > 0) {
      const interests = user.interestCategories;

      const connections = user.connection;
      const requestsPending = user.requestPending;

      const requestsReceived = user.requestReceived;

      const idsToExclude = connections.concat(
        requestsPending,
        requestsReceived,
        new ObjectId(id)
      );

      const users = await User.aggregate([
        { $match: { _id: { $nin: idsToExclude } } },
        { $match: { interestCategories: { $in: interests } } },
      ]);
      if (users.length > 0)
        return NextResponse.json(
          {
            result: users,
          },
          { status: 200 }
        );
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
