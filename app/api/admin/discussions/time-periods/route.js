import Discussion from "@/app/(models)/discussionModel";
import connect from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const firstDiscussion = await Discussion.findOne().sort({ createdAt: 1 });
    const firstDiscussionDate = new Date(firstDiscussion.createdAt);
    const currentDate = new Date();
    const timePeriods = [];

    // Initialize end of the current period as the end of the current month
    let endOfCurrentPeriod = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Start with the month 5 months before the current month (making a 6-month period)
    let startOfCurrentPeriod = new Date(
      endOfCurrentPeriod.getFullYear(),
      endOfCurrentPeriod.getMonth() - 5,
      1
    );

    while (
      startOfCurrentPeriod >= firstDiscussionDate ||
      (startOfCurrentPeriod.getFullYear() ===
        firstDiscussionDate.getFullYear() &&
        startOfCurrentPeriod.getMonth() === firstDiscussionDate.getMonth())
    ) {
      timePeriods.unshift({
        startOfPeriod: startOfCurrentPeriod,
        endOfPeriod: endOfCurrentPeriod,
      });

      // Move to the previous period (6 months before the start of the current period)
      endOfCurrentPeriod = new Date(
        startOfCurrentPeriod.getFullYear(),
        startOfCurrentPeriod.getMonth(),
        0
      );
      startOfCurrentPeriod = new Date(
        endOfCurrentPeriod.getFullYear(),
        endOfCurrentPeriod.getMonth() - 5,
        1
      );
    }

    if (startOfCurrentPeriod < firstDiscussionDate) {
      if (endOfCurrentPeriod < firstDiscussionDate) {
        // Handle this case if needed
      } else {
        timePeriods.unshift({
          startOfPeriod: firstDiscussionDate,
          endOfPeriod: endOfCurrentPeriod,
        });
      }
    }

    return NextResponse.json(timePeriods, { status: 200 });
  } catch (error) {
    console.error("Error creating time periods:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
