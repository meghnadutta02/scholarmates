import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

export async function GET(req, { params }) {
  try {
    await connect();

    const { id: userId } = params;

    if (!mongoose.isValidObjectId(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await User.clearUserDocument(userId);

    return NextResponse.json(
      { message: "User document cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing user document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
