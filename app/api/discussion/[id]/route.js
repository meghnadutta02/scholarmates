import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import User from "@/app/(models)/userModel";
import groupRequest from "@/app/(models)/groupRequestModel";
import { postObject, deleteObject } from "@/app/config/s3";

//get a discussion
export async function GET(req, { params }) {
  await connect();
  const id = params.id;
  const session = await getServerSession(options);

  try {
    const discussion = await Discussion.findById(id).populate(
      "creator likedBy",
      "name profilePic _id"
    );

    if (!discussion) {
      return NextResponse.json(
        { result: "Discussion not found." },
        { status: 500 }
      );
    }
    const userId = new ObjectId(session?.user?.db_id);
    let status = "";
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ result: "User not found." }, { status: 404 });
    }

    if (user.groupsJoined.includes(discussion.groupId)) {
      status = "accepted";
    } else {
      const groupRequests = await groupRequest.find({
        fromUser: userId,
        groupId: discussion.groupId,
      });
      if (groupRequests.length > 0) {
        status = groupRequests[0].status;
      }
    }
    const isLikedByUser = discussion.likedBy
      .map((user) => user._id.toString())
      .includes(userId.toString());

    const isDislikedByUser = discussion.dislikedBy
      .map((user) => user._id.toString())
      .includes(userId.toString());

    return NextResponse.json(
      { discussion, isLikedByUser, status, isDislikedByUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//delete a discussion
export async function DELETE(req, { params }) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = params.id;

    if (id && session) {
      const discussion = await Discussion.findById(id);

      if (!discussion) {
        return NextResponse.json(
          { result: "Discussion not found" },
          { status: 404 }
        );
      }

      if (discussion.creator.toString() !== session.user.db_id) {
        return NextResponse.json({ result: "Unauthorized" }, { status: 403 });
      }
      // FIRST DELETE IMAGES FROM S3 BUCKET

      const discussionCoverImageUrl = discussion.coverImage;
      const discussionCoverImageKey = discussionCoverImageUrl
        ? decodeURIComponent(
            discussionCoverImageUrl.split("/").slice(-2).join("/")
          ) // Adjust the slice as necessary based on your URL structure
        : null;

      // Delete the DISCUSSION  picture from S3 if it exists
      if (discussionCoverImageKey) {
        await deleteObject(discussionCoverImageKey);
      }

      await discussion.deleteOne();

      return NextResponse.json(
        { groupId: discussion.groupId },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//update a discussion
export async function PUT(req, { params }) {
  try {
    await connect();
    const { id } = params;
    const session = await getServerSession(options);
    const data = await req.formData();
    console.log("kuchkuch", data);
    let title = data.get("title");

    const type = data.get("type");

    const content = data.get("content");
    const subcategories = data.getAll("subcategories");
    const file = data.get("coverImage");

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    if (discussion.creator.toString() !== session.user.db_id) {
      return NextResponse.json({ result: "Unauthorized" }, { status: 403 });
    }

    if (title) {
      title = title.trim();
      title = title[0].toUpperCase() + title.slice(1);
      discussion.title = title;
    }
    if (type) discussion.type = type;

    if (content) discussion.content = content;
    if (subcategories.length > 0) discussion.subcategories = subcategories;

    if (file != null) {
      const discussionCoverImageUrl = discussion.coverImage;
      const discussionCoverImageKey = discussionCoverImageUrl
        ? decodeURIComponent(
            discussionCoverImageUrl.split("/").slice(-2).join("/")
          ) // Adjust the slice as necessary based on your URL structure
        : null;

      //UPDATE picture from S3 if it exists

      if (discussionCoverImageKey) {
        await deleteObject(discussionCoverImageKey);
      }
    }

    let coverImage = "";
    if (file && file instanceof File) {
      const byteData = await file.arrayBuffer();
      const buffer = Buffer.from(byteData);
      const path = `public/${file.name}`;
      coverImage = await postObject(path, buffer);
      if (coverImage) discussion.coverImage = coverImage;
    }

    const updatedDiscussion = await discussion.save();
    return NextResponse.json({ result: updatedDiscussion }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
