import {Postkaro} from "../../../(models)/postkaroModel"
import { User } from "../../../(models)/userModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { postObject } from "@/app/config/s3";


export async function GET() {
  try {
    await connect();

    // Determine the page number and page size
    // const page = parseInt(query.page) || 1;
    // const pageSize = 5;
    // const skip = (page - 1) * pageSize;

    // Fetch posts with pagination, sorting by createdAt field in descending order
    const data = await Postkaro.find({});
      

    console.log(data);

    if (data.length > 0) {
      return NextResponse.json({ result: data });
    } else {
      return NextResponse.json({
        error: "No posts found",
        success: false
      });
    }
  } catch (error) {
    console.error("Error occurred while fetching posts:", error);
    return NextResponse.json({
      error: "Error occurred while fetching posts",
      success: false
    });
  }
}


// ================Post data==========

export async function POST(req, { params }) {
  await connect();
  
  const userId = params.post;
  console.log(userId)
  const data = await req.formData();
  const formDataArray = Array.from(data.values()); // Get all form values
  const description = formDataArray.shift();
  const caption = "kuch nhi";
  const files = formDataArray.filter(value => value instanceof File); 
  console.log(files); // Use getAll to get all images
  



// Usage example


  if (!files || files.length === 0) {
    
    return NextResponse.json({ error: "No files found", success: false });
  }

  try {
    const uploadedImages = [];

    for (const file of files) {
      
      
      const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `public/${file.name}`;
    const uploadedImage = await postObject(path, buffer);
    uploadedImages.push(uploadedImage);

      
    }
// console.log(uploadedImages)

//==============upload image in database==========


if(uploadedImages){
  const newPost = await Postkaro({
    userId: userId,
    description: description,
    image: uploadedImages, // Assign the array of uploaded images
    caption: caption,
    
  });
  
  // console.log(newPost)  //check the structure of the data save in db

  const data=await newPost.save();

  // console.log(data);      //check what data we get from database

// Save the new post to the database

  if (data) {
    console.log(data)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: data._id } },
      { new: true }
    );
    console.log(updatedUser);
  }
}


    return NextResponse.json({
      result: "Posts uploaded",
      success: true,
    });
  } catch (error) {
    console.error("Error occurred while uploading posts:", error);
    return NextResponse.json({
      error: "Error occurred while uploading posts",
      success: false,
    });
  }
}
