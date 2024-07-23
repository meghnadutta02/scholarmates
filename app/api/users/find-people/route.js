import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    await connect();
    const id = req.nextUrl.searchParams.get("id");

    const user = await User.findById(id).select(
      "connection requestPending requestReceived"
    );
    const connections = user.connection;
    const requestsPending = user.requestPending;

    const requestsReceived = user.requestReceived;

    const idsToExclude = connections.concat(
      requestsPending,
      requestsReceived,
      new ObjectId(id)
    );

    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: idsToExclude },
          interestCategories: { $exists: true, $not: { $size: 0 } },
          interestSubcategories: { $exists: true, $not: { $size: 0 } },
        },
      },
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
        { result: [], message: "No user profiles" },
        { status: 200 }
      );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
