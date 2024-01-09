import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { connect } from "mongoose";
import { hashPassword } from "@/app/utils/hashPassword";

//register user
export async function POST(req) {
  try {
    await connect();
    const { name, email, password } = JSON.parse(req.body);

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format!" },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 400 }
      );
    } else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      return NextResponse.json({ result: user }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
//get all users
export async function GET(req) {
  try {
    await connect();

    const users = await User.find({});

    return NextResponse.json({ result: users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
