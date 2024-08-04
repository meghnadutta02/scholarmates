import { NextResponse } from "next/server";
import SupportRequest from "@/app/(models)/supportRequestModel";
import connect from "@/app/config/db";
import { SendMail } from "@/app/config/S3S";

export async function POST(req) {
  try {
    await connect();

    const { userEmail, message, supportId } = await req.json();

    const supportData = await SupportRequest.findById(supportId);
    if (!supportData) {
      return NextResponse.json(
        { message: "Not request present" },
        { status: 401 }
      );
    }
    await SendMail(
      supportData.userName,
      supportData.subject,
      userEmail,
      message
    );

    supportData.status = "in review";
    await supportData.save();

    return NextResponse.json(
      { message: "Reply sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connect();
    const { supportId, status } = await req.json();
    console.log(supportId, status);

    await SupportRequest.findByIdAndUpdate(
      { _id: supportId },
      { $set: { status: status === "resolved" ? "in review" : "resolved" } }
    );

    return NextResponse.json(
      { message: "Support request resolved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
