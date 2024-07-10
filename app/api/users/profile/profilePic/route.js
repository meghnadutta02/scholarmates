import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/app/config/db";
import { postObject } from "@/app/config/s3";

// Update user profile picture
export async function PUT(req) {
  try {
    await connect();

    const session = await getServerSession(options);
    const id = session?.user?.db_id;

    if (!id) {
      return NextResponse.json({ result: "User not found" }, { status: 401 });
    }

    const data = await req.formData();
    const updatedUserData = data.get("profilePic");

    if (!updatedUserData) {
      return NextResponse.json({ result: "No request data" }, { status: 400 });
    }

    const byteData = await updatedUserData.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `public/${updatedUserData.name}`;
    const coverImage = await postObject(path, buffer);

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { profilePic: coverImage } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ result: user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
