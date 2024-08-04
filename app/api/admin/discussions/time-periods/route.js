import moment from "moment";
import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const firstDiscussion = await Discussion.findOne().sort({ createdAt: 1 });
    const firstDiscussionDate = moment(firstDiscussion.createdAt);
    const currentMonth = moment();
    const timePeriods = [];

    // Initialize end of the current period as the end of the current month
    let endOfCurrentPeriod = currentMonth.endOf("month").toDate();

    // Start with the month 5 months before the current month (making a 6-month period)
    let startOfCurrentPeriod = moment(endOfCurrentPeriod)
      .subtract(5, "months")
      .startOf("month")
      .toDate();

    while (
      moment(startOfCurrentPeriod).isAfter(firstDiscussionDate) ||
      moment(startOfCurrentPeriod).isSame(firstDiscussionDate, "month")
    ) {
      timePeriods.unshift({
        startOfPeriod: startOfCurrentPeriod,
        endOfPeriod: endOfCurrentPeriod,
      });

      // Move to the previous period (6 months before the start of the current period)
      endOfCurrentPeriod = moment(startOfCurrentPeriod)
        .subtract(1, "day")
        .endOf("month")
        .toDate();
      startOfCurrentPeriod = moment(endOfCurrentPeriod)
        .subtract(5, "months")
        .startOf("month")
        .toDate();
    }

    if (moment(startOfCurrentPeriod).isBefore(firstDiscussionDate)) {
      if (moment(endOfCurrentPeriod).isBefore(firstDiscussionDate)) {
      } else {
        timePeriods.unshift({
          startOfPeriod: firstDiscussionDate.toDate(),
          endOfPeriod: endOfCurrentPeriod,
        });
      }
    }

    console.log("Time periods:", timePeriods);
    return NextResponse.json(timePeriods, { status: 200 });
  } catch (error) {
    console.error("Error creating time periods:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
