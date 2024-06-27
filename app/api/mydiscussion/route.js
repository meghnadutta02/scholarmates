import Discussion from "@/app/(models)/discussionModel";
import Group from "@/app/(models)/groupModel";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { postObject } from "@/app/config/s3";


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

export async function PUT(req) {
    try {
      await connect();
      const id = req.nextUrl.searchParams.get('id');
      console.log(id);
      const session = await getServerSession(options);
      const data = await req.formData();
     // Assuming you're passing the discussion ID
      let title = data.get("title");
      const groupTitle = data.get("groupTitle");
      const type = data.get("type");
      const privacy = data.get("privacy");
      const content = data.get("content");
      const subcategories = data.getAll("subcategories");
      const file = data.get("coverImage");
      title = title.trim();
      title = title[0].toUpperCase() + title.slice(1);
      let coverImage = "";
  
      if (file && file instanceof File) {
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const path = `public/${file.name}`;
        coverImage = await postObject(path, buffer);
      }
  
      const discussion = await Discussion.findById(id);
      if (!discussion) {
        throw new Error('Discussion not found');
      }
  
      discussion.title = title;
      discussion.type = type;
      discussion.privacy = privacy;
      discussion.content = content;
      discussion.subcategories = subcategories;
      if (coverImage) {
        discussion.coverImage = coverImage;
      }
  
      const group = await Group.findById(discussion.groupId);
      if (!group) {
        throw new Error('Group not found');
      }
  
      group.name = groupTitle;
      group.isPublic = privacy === "public";
      group.type = type;
      group.description = `Group for discussion: ${title}`;
      await group.save();
  
      await discussion.save();
  
      return NextResponse.json(
        { result: discussion },
        { status: 200 }
      );
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  