import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/app/config/db";

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;
    const user = await User.findOne({
      _id: id,
    }).select("-createdAt -updatedAt -__v");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ result: user }, { status: 200 });
    n;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;
    const updatedData = await req.json();
    const updatedUserData = updatedData.formData;
    console.log(updatedUserData);

    // const user = await User.findByIdAndUpdate(
    //   id,
    //   { $set: updatedUserData },
    //   { new: true }
    // );
    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }
    // return NextResponse.json({ result: user }, { status: 200 });
    return NextResponse.json({ result: updatedUserData }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
