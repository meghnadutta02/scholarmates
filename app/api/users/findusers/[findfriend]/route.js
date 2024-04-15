import { NextResponse } from "next/server";
import User from "@/app/(models)/userModel";
import connect from "@/app/config/db";

//get all users
export async function GET(req, { params }) {
  try {
    await connect();

    const users = await User.find({ _id: { $ne: params.findusers } });

    return NextResponse.json({ result: users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// const data = [
//   {
//     name: "Aarav Gupta",
//     email: "aarav.gupta@gmail.com",

//     collegeName: "University of Calcutta",
//     yearInCollege: 2,
//     department: "Computer Science and Engineering",
//     degree: "Bachelor of Technology",
//     dob: new Date("2004-05-15"),
//     interestCategories: ["Programming", "Development", "Movies"],
//     interestSubcategories: [
//       "React Native",
//       "Flutter",
//       "Java",
//       "C",
//       "C++",
//       "HTML/CSS",
//       "Mobile App Development",
//       "Action",
//       "Drama",
//       "Horror",
//       "Mystery",
//     ],
//   },
//   {
//     name: "Isha Patel",
//     email: "isha.patel@gmail.com",

//     collegeName: "Jadavpur University",
//     yearInCollege: 3,
//     department: "Electrical Engineering",
//     degree: "Bachelor of Engineering",
//     dob: new Date("2003-10-20"),
//     interestCategories: ["Technology", "Music"],
//     interestSubcategories: [
//       "Machine Learning",
//       "Cloud Computing",
//       "Guitar",
//       "Piano",
//     ],
//   },
//   {
//     name: "Vihaan Das",
//     email: "vihaan.das@gmail.com",

//     collegeName: "St. Xavier's College",
//     yearInCollege: 1,
//     department: "Physics",
//     degree: "Bachelor of Science",
//     dob: new Date("2004-03-08"),
//     interestCategories: ["Science", "Reading"],
//     interestSubcategories: [
//       "Physics",
//       "Astronomy",
//       "Mystery",
//       "Science Fiction",
//     ],
//   },
//   {
//     name: "Anaya Banerjee",
//     email: "anaya.banerjee@gmail.com",

//     collegeName: "Heritage Institute of Technology",
//     yearInCollege: 4,
//     department: "Computer Science and Engineering",
//     degree: "Bachelor of Technology",
//     dob: new Date("2002-08-25"),
//     interestCategories: ["Programming", "Development", "Technology"],
//     interestSubcategories: [
//       "AI",
//       "AWS",
//       "Azure",
//       "Cloud Computing",
//       "Web Development",
//       "C++",
//       "OOPs",
//       "MERN Stack",
//       "DP",
//       "HTML/CSS",
//     ],
//   },
//   {
//     name: "Kabir Singh",
//     email: "kabir.singh@gmail.com",

//     collegeName: "Heritage Institute of Technology",
//     yearInCollege: 4,
//     department: "Civil Engineering",
//     degree: "Bachelor of Technology",
//     dob: new Date("2002-08-25"),
//     interestCategories: ["Dance", "Photography"],
//     interestSubcategories: [
//       "Street Photography",
//       "Wildlife Photography",
//       "Hip Hop",
//       "Contemporary ",
//     ],
//   },
//   {
//     name: "Tripti Dixit",
//     email: "tripti.dixit@gmail.com",

//     collegeName: "Techno India University",
//     yearInCollege: 2,
//     department: "Mechanical Engineering",
//     degree: "Bachelor of Engineering",
//     dob: new Date("2003-12-10"),
//     interestCategories: ["Music", "Dance"],
//     interestSubcategories: ["Singing", "Bharatanatyam", "Kathak", "Hip Hop"],
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
