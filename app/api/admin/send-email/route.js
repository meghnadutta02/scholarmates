// import { sendEmail } from "@/app/config/ses";
import { NextResponse } from "next/server";
import SupportRequest from "@/app/(models)/supportRequestModel";
import connect from "@/app/config/db";
import nodemailer from "nodemailer";
import { CreateTemplate, SendMail } from "@/app/config/S3S";
export async function POST(req) {
  try {
    await connect();

    const { userEmail, message, supportId } = await req.json();
    console.log(userEmail, message, supportId);

    // When change the templet call once
    //  CreateTemplate();

     const supportData= await SupportRequest.findById(supportId);
     if(!supportData){
      return NextResponse.json(
        { message: "Not request present" },
        { status: 401 }
      );
     }
      await SendMail(supportData.userName,supportData.subject,userEmail, message);
     // Set status to 'resolved'
      supportData.status = 'resolved';
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

