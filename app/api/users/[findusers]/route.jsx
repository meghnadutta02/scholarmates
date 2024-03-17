import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

//get all users
export async function GET(req,{params}) {
  try {
    await connect();

    const users = await User.find({_id:{$ne:params.findusers}});

    return NextResponse.json({ result: users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// const data = [
//   {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     isAdmin: false,
//     collegeName: "ABC University",
//     yearInCollege: 2,
//     department: "ECE",
//     interests: [
//       {
//         category: "Programming",
//         subcategories: [
//           "React Native",
//           "Flutter",
//           "Java",
//           "C",
//           "C++",
//           "HTML/CSS",
//         ],
//       },
//       {
//         category: "Development",
//         subcategories: ["Mobile App Development"],
//       },
//       {
//         category: "Movies",
//         subcategories: ["Action", "Drama", "Horror", "Mystery"],
//       },
//     ],
//     dob: "2004-05-15",
//     degree: "Btech",
//   },

//   {
//     name: "Alice Johnson",
//     email: "alice.johnson@example.com",
//     isAdmin: false,
//     collegeName: "XYZ College",
//     yearInCollege: 3,
//     department: "Mechanical Engineering",
//     interests: [
//       {
//         category: "Programming",
//         subcategories: ["Solidity", "Ethereum", "GraphQL"],
//       },
//       {
//         category: "Technology",
//         subcategories: ["Blockchain"],
//       },
//     ],
//     dob: "2002-08-22",
//     degree: "Btech",
//   },
//   {
//     name: "Bob Smith",
//     email: "bob.smith@example.com",
//     isAdmin: false,
//     collegeName: "IEM Kolkata",
//     yearInCollege: 4,
//     department: "Chemical Engineering",
//     interests: [
//       {
//         category: "Programming",
//         subcategories: ["Python", "Java", "C++", "HTML/CSS", "Firebase"],
//       },
//       {
//         category: "Technology",
//         subcategories: ["Machine Learning", "AI"],
//       },
//       {
//         category: "Gaming",
//         subcategories: ["Call of Duty", "Valorant", "PUBG"],
//       },
//     ],
//     dob: "2000-04-10",
//     degree: "Btech",
//   },
//   {
//     name: "Eva Rodriguez",
//     email: "eva.rodriguez@example.com",
//     isAdmin: true,
//     collegeName: "PQR Institute",
//     yearInCollege: 2,
//     department: "Human Resources",
//     interests: [
//       {
//         category: "Finance and Investing",
//         subcategories: [
//           "Economic Trends",
//           "Personal Finance",
//           "Stock Market Investing",
//           "Cryptocurrency",
//         ],
//       },
//       {
//         category: "Travel",
//         subcategories: ["Adventure", "Cultural", "Beach"],
//       },
//     ],
//     dob: "2003-12-05",
//     degree: "MBA",
//   },
//   {
//     name: "Samuel Wilson",
//     email: "samuel.wilson@example.com",
//     isAdmin: false,
//     collegeName: "LMN College",
//     yearInCollege: 3,
//     department: "Electrical Engineering",
//     interests: [
//       {
//         category: "Programming",
//         subcategories: ["Java", "C++", "HTML/CSS", "Firebase"],
//       },
//       {
//         category: "Books",
//         subcategories: [
//           "Mystery",
//           "Science Fiction",
//           "Fantasy",
//           "Historical Fiction",
//           "Thriller",
//         ],
//       },
//       {
//         category: "Movies",
//         subcategories: ["Sci-Fi", "Thriller", "Fantasy"],
//       },
//     ],
//     dob: "2004-01-02",
//     degree: "Btech",
//   },
//   {
//     name: "Sophia Turner",
//     email: "sophia.turner@example.com",
//     isAdmin: false,
//     collegeName: "XYZ University",
//     yearInCollege: 1,
//     department: "Civil Engineering",
//     interests: [
//       {
//         category: "Programming",
//         subcategories: ["Python", "Java", "C"],
//       },
//       {
//         category: "Science",
//         subcategories: ["Physics", "Chemistry"],
//       },
//     ],
//     dob: "2001-03-27",
//     degree: "Btech",
//   },
// ];

// export async function GET(req) {
//   try {
//     await connect();

//     const users = await User.insertMany(data);

//     return NextResponse.json(
//       { result: users, message: "Data inserted" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
