import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

//get matching user profiles
export async function GET(req) {
  try {
    await connect();
    const id = req.nextUrl.searchParams.get("id");

    const user = await User.findById(id).select(
      "interestCategories connection requestPending"
    );
    const getReq = await User.findById(id).select("requestReceived");

    console.log("user", user);
    if (user.interestCategories.length > 0) {
      const interests = user.interestCategories;

      const connections = user.connection;
      connections.push(id);

      const users = await User.aggregate([
        { $match: { _id: { $nin: connections } } },
        { $match: { interestCategories: { $in: interests } } },
      ]);
      console.log("user 3", user);
      if (users.length > 0)
        return NextResponse.json(
          {
            result: users,
            requests: user.requestPending,
            requestReceived: getReq.requestReceived,
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
