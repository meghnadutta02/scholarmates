import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/app/config/db";
import { postObject,deleteObject} from "@/app/config/s3";
import { v4 as uuidv4 } from "uuid";

// Update user profile picture
export async function PUT(req) {
  try {
    await connect();
    const session = await getServerSession(options);
    const id = session?.user?.db_id;
    const name = session?.user?.name;

    if (!id) {
      return NextResponse.json({ result: "User not found" }, { status: 401 });
    }

    const data = await req.formData();
    const updatedUserData = data.get("profilePic");

    if (!updatedUserData) {
      return NextResponse.json({ result: "No request data" }, { status: 400 });
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract the current profile picture key from the URL
    const currentProfilePicUrl = user.profilePic;
    const currentProfilePicKey = currentProfilePicUrl
      ?decodeURIComponent(currentProfilePicUrl.split("/").slice(-3).join("/")) // Adjust the slice as necessary based on your URL structure
      : null;

    // Delete the current profile picture from S3 if it exists
    if (currentProfilePicKey) {
      await deleteObject(currentProfilePicKey);
    }

    const byteData = await updatedUserData.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const uniqueFileName = `${uuidv4()}_${name}`;
    const path = `public/profilePicture/${uniqueFileName}.jpg`;
    const coverImage = await postObject(path, buffer);
    user.profilePic = coverImage;
    await user.save();
   

    return NextResponse.json({ result: user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
