import connect from "@/socketServer/db";
import User from "@/app/(models)/userModel";
import request from "@/app/(models)/requestModel";
import { NextResponse } from "next/server";
import setupServer from "../../socket/route";


export async function POST(req,res ,{ params }) {
  try {
    await connect();
    
    await setupServer();
    
    const senderId = params.senderconnections;
    const { recipientId } = await req.json();
    console.log(senderId, recipientId);
    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(recipientId);

    if (!senderUser || !receiverUser) {
      return NextResponse.json({ message: 'User not found' });
    }

    // Check if friendship already exists
    const existingFriendship = await request.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (existingFriendship) {
      return NextResponse.json({ message: 'Friendship request already sent or accepted' });
    }

    // Create a new friendship request
    const friendshipRequest = new request({
      participants: [senderId, recipientId],
      requestTo: recipientId,
      user: senderId
    });

    await friendshipRequest.save();

    
    

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
