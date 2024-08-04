import { NextResponse } from "next/server";
import connect from "@/app/config/db";
import SupportRequest from "@/app/(models)/supportRequestModel";

export async function GET(req) {
  try {
    await connect();

    const allRequests = await SupportRequest.aggregate([
      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "in review"] }, then: 2 },
                { case: { $eq: ["$status", "resolved"] }, then: 3 },
              ],
              default: 4,
            },
          },
          sortDate: {
            $cond: {
              if: { $eq: ["$status", "resolved"] },
              then: { $multiply: [-1, { $toLong: "$createdAt" }] },
              else: { $toLong: "$createdAt" },
            },
          },
        },
      },
      {
        $sort: {
          priority: 1,
          sortDate: 1,
        },
      },
    ]);

    return NextResponse.json({ supportRequests: allRequests }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
