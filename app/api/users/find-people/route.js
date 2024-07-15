import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

export async function GET(req) {
  try {
    await connect();
    const id = req.nextUrl.searchParams.get("id");

    const user = await User.findById(id).select("connection requestPending");
    const getReq = await User.findById(id).select("requestReceived");
    const connections = user.connection;
    connections.push(id);

    const users = await User.aggregate([
      { $match: { _id: { $nin: connections } } },
    ]);

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
        { result: [], message: "No user profiles" },
        { status: 200 }
      );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
