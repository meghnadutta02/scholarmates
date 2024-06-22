import connect from "@/socketServer/db";
import User from "@/app/(models)/userModel";
import { NextResponse } from "next/server";
import request from "@/app/(models)/requestModel";

export async function POST(req, { params }) {
    try {
        await connect();
        // const userId = params.receiverconnection;
        const { userId, friendshipId,action } = await req.json();
        console.log(userId, friendshipId,action);

        const friendshipRequest = await request.findById(friendshipId);
        console.log(friendshipRequest)

        if (!friendshipRequest) {
            return res.status(404).json({ message: 'Friendship request not found' });
        }

        if (!userId || !friendshipRequest.participants.includes(userId)) {
            return res.status(403).json({ message: 'You do not have permission to accept this request' });
        }
        if (action === 'accept') {
            // Accept the request
            const user = await User.findById(friendshipRequest.requestTo);
            const sender = await User.findById(friendshipRequest.user);
            if (user || sender) {
                user.connection.push(sender._id);
                await user.save();

                sender.connection.push(user._id);
                await sender.save();
            }
            console.log(user, sender);
        } else if (action === 'decline') {
            // Decline the request
            await friendshipRequest.deleteOne();
        } else {
            return NextResponse.json({ message: 'Invalid action specified' });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// decline request

