import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { connect } from "mongoose";
import { comparePasswords } from "@/app/utils/hashPassword";

// Logs in user
export async function POST(req) {
  try {
    await connect();
    const { email, password } = JSON.parse(req.body);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return NextResponse.json(
        { error: "Account does not exist, please sign up" },
        { status: 400 }
      );
    } else {
      const passwordMatch = comparePasswords(password, userExists.password);

      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Incorrect password" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
