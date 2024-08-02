import { NextResponse } from "next/server";
import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";
import Discussion from "@/app/(models)/discussionModel";

// GET all the users with pagination
export async function GET(req) {
  try {
    await connect();

    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const allUsers = await User.find({})
      .select(
        "-bio -requestPending -requestReceived -dob -interestSubcategories -interestCategories -proficiencies"
      )
      .skip(skip)
      .limit(limit);

    const discussions = await Discussion.find({});

    const usersWithCounts = allUsers.map((user) => ({
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
      email: user.email,
      isAdmin: user.isAdmin,
      collegeName: user.collegeName,
      yearInCollege: user.yearInCollege,
      department: user.department,
      degree: user.degree,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      numberOfConnections: user.connection.length,
      numberOfGroupsJoined: user.groupsJoined.length,
      numberOfDiscussions: discussions.filter((discussion) =>
        discussion.creator.equals(user._id)
      ).length,
    }));

    const totalUsers = await User.countDocuments({});

    return NextResponse.json(
      {
        users: usersWithCounts,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        totalUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
