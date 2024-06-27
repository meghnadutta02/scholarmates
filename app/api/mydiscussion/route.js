import Discussion from "@/app/(models)/discussionModel";
import Group from "@/app/(models)/groupModel";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req) {
    try {
        await connect();
        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const myDiscussion = await Discussion.find({ creator: session?.user?.db_id });
        console.log(myDiscussion);
        return NextResponse.json({ result: myDiscussion }, { status: 200 });
    } catch (error) {
        console.log("Error in getting myDiscussion data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req,res) {
    try {
        await connect();
        const session = await getServerSession(options);
        const id = req.nextUrl.searchParams.get('id');
        if(id && session){
            const discussion = await Discussion.findById(id);
      if (!discussion) {
        return NextResponse.json({ result: "Discussion not found" },{ status: 401 })
      }
      const group = await Group.findById(discussion.groupId);
      if (!group) {
        return NextResponse.json({ result: "Discussion group not found" },{ status: 401 })
      }
      await Discussion.findByIdAndDelete(id);
      await Group.findByIdAndDelete(discussion.groupId);

      return NextResponse.json({ result: "Discussion delete sucessfully" },{ status: 200 })
       
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}