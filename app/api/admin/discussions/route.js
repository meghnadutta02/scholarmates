import moment from "moment";
import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  const startOfPeriod = new Date(req.nextUrl.searchParams.get("startOfPeriod"));
  const endOfPeriod = new Date(req.nextUrl.searchParams.get("endOfPeriod"));

  try {
    const monthlyDiscussions = await Discussion.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfPeriod, $lte: endOfPeriod },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const sixMonthsData = [];
    for (let i = 5; i >= 0; i--) {
      const month = moment(endOfPeriod).subtract(i, "months");
      sixMonthsData.push({
        month: month.format("MMMM"),
        discussions: (
          monthlyDiscussions.find((d) => d._id === month.month() + 1) || {
            count: 0,
          }
        ).count,
      });
    }

    if (moment(endOfPeriod).isSame(moment(), "month")) {
      const currentMonthData = sixMonthsData.find(
        (d) => d.month === moment().format("MMMM")
      ) || { discussions: 0 };

      const lastMonthData = sixMonthsData.find(
        (d) => d.month === moment().subtract(1, "month").format("MMMM")
      ) || { discussions: 0 };

      const percentageChange =
        lastMonthData.discussions > 0
          ? ((currentMonthData.discussions - lastMonthData.discussions) /
              lastMonthData.discussions) *
            100
          : 0;

      const trend = percentageChange > 0 ? "increase" : "decrease";

      return NextResponse.json({
        monthlyData: sixMonthsData,
        currentMonthDiscussions: currentMonthData.discussions,
        lastMonthDiscussions: lastMonthData.discussions,
        percentageChange: Math.abs(Math.round(percentageChange)),
        trend,
      });
    } else {
      return NextResponse.json({ monthlyData: sixMonthsData }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
