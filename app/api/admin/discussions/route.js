import moment from "moment";
import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";

export async function calculateMonthlyTrends() {
  await connect();

  const startOfSixMonths = moment()
    .subtract(6, "months")
    .startOf("month")
    .toDate();
  const endOfCurrentMonth = moment().endOf("month").toDate();

  try {
    const monthlyDiscussions = await Discussion.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfSixMonths, $lte: endOfCurrentMonth },
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
      const month = moment().subtract(i, "months");
      sixMonthsData.push({
        month: month.format("MMMM"),
        discussions: (
          monthlyDiscussions.find((d) => d._id === month.month() + 1) || {
            count: 0,
          }
        ).count,
      });
    }

    const currentMonthName = moment().format("MMMM");
    const lastMonthName = moment().subtract(1, "month").format("MMMM");

    const currentMonthData = sixMonthsData.find(
      (d) => d.month === currentMonthName
    ) || {
      discussions: 0,
    };
    const lastMonthData = sixMonthsData.find(
      (d) => d.month === lastMonthName
    ) || {
      discussions: 0,
    };

    const totalDiscussionsLastMonth = lastMonthData.discussions;

    const percentageChange =
      totalDiscussionsLastMonth > 0
        ? ((currentMonthData.discussions - totalDiscussionsLastMonth) /
            totalDiscussionsLastMonth) *
          100
        : 0;

    const trend = percentageChange > 0 ? "increase" : "decrease";

    return {
      monthlyData: sixMonthsData,
      currentMonthDiscussions: currentMonthData.discussions,
      lastMonthDiscussions: totalDiscussionsLastMonth,
      percentageChange: Math.abs(Math.round(percentageChange)),
      trend,
    };
  } catch (error) {
    console.error("Error calculating monthly trends:", error);
    throw new Error(error);
  }
}

export async function GET(req) {
  try {
    const monthlyTrends = await calculateMonthlyTrends();
    return NextResponse.json(monthlyTrends, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
