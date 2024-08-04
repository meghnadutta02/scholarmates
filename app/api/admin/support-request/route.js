import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import connect from "@/app/config/db";
import SupportRequest from "@/app/(models)/supportRequestModel";

// GET all the support requests
export async function GET(req) {
  try {
    await connect();
    // const session = await getServerSession(options);
    // const userId = session?.user?.db_id;

    const allRequests = await SupportRequest.find({}).sort({
      status: 1,
      createdAt: -1,
    });

    return NextResponse.json({ supportRequests: allRequests }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Submit a new request
export async function POST(req) {
  try {
    await connect();
    const requestData = await req.json();
    console.log("sjnsknksnd", requestData);
    const newSupportRequest = new SupportRequest({
      userEmail: requestData.email,
      userName: requestData.name,
      subject: requestData.subject,
      message: requestData.message,
    });

    await newSupportRequest.save();

    return NextResponse.json(
      { message: "Support request submitted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a support request
export async function DELETE(req) {
  try {
    await connect();
    const id = req.nextUrl.searchParams.get("supportId");

    const deletedRequest = await SupportRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { error: "Support request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Support request deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
