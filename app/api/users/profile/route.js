import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/app/config/db";

//get user profile
export async function GET(req) {
  try {
    await connect();
    const data = req.nextUrl.searchParams.get("id");

    if (data) {
      const user = await User.findOne({
        _id: data,
      }).select("-createdAt -updatedAt -__v");

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ result: user }, { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
//update user profile
export async function PUT(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;
    const updatedData = await req.json();
    const updatedUserData = updatedData.formData;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updatedUserData },
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

// UNFOLLOW CONNECTIONS

export async function POST(req, resp) {
  try {
    await connect();
    const secondUserId = req.nextUrl.searchParams.get("seconduserId");

    const session = await getServerSession(options);
    const id = session?.user?.db_id;

    if (secondUserId && id) {
      const user = await User.findById(id);
      const secondUser = await User.findById(secondUserId);

      if (!user || !secondUser) {
        return NextResponse.json(
          { error: "Something missing in user and second user" },
          { status: 401 }
        );
      }
      await user.connection.pull(secondUserId);
      await secondUser.connection.pull(id);
      // Your logic to update the user and second user

      await user.save(); // Save the changes
      await secondUser.save(); // Save the changes

      return NextResponse.json(
        { success: "Unfollowed this user" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "User IDs are missing" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
