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

     const supportData= await SupportRequest.findById(supportId);
    //  CreateTemplate();
     if(!supportData){
      return NextResponse.json(
        { message: "Not request present" },
        { status: 401 }
      );
     }
      await SendMail("Meghna Dutta",supportData.subject,"meghnakha18@gmail.com", message);

    return NextResponse.json(
      { message: "Reply sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const sendEmail = async (userEmail, message) => {
  const transporter = nodemailer.createTransport({
    host: "email-smtp.ap-south-1.amazonaws.com",
    port: 587,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: {
      name: "ScholarMates Support",
      address: process.env.SENDER_EMAIL,
    },
    to: userEmail,
    subject: "Re : Support Request",
    text: message,
  };

  await transporter.sendMail(mailOptions);
};
