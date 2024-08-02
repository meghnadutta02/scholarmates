// import { sendEmail } from "@/app/config/ses";
import { NextResponse } from "next/server";
import SupportRequest from "@/app/(models)/supportRequestModel";
import connect from "@/app/config/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connect();

    const { userEmail, message, supportId } = await req.json();
    console.log(userEmail, message, supportId);

    await sendEmail(userEmail, message);
    await SupportRequest.findOneAndUpdate(
      { _id: supportId },
      { $set: { status: "resolved" } }
    );

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
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: {
      name: "ScholarMates Support",
      address: process.env.EMAIL_ADDRESS,
    },
    to: userEmail,
    subject: "Re : Support Request",
    text: message,
  };

  await transporter.sendMail(mailOptions);
};
