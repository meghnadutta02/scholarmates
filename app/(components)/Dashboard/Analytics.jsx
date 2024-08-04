"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Charts from "@/app/(components)/Dashboard/Charts";
import Loading from "../Loading";
import { FaArrowUp } from "react-icons/fa";

const Analytics = () => {
  const [discussionsLoading, setDiscussionsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentMonthDiscussions, setCurrentMonthDiscussions] = useState(0);
  const [lastMonthDiscussions, setLastMonthDiscussions] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [trend, setTrend] = useState("");
  const [timePeriods, setTimePeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    const fetchTimePeriods = async () => {
      try {
        const response = await fetch("/api/admin/discussions/time-periods");
        const periods = await response.json();
        
        setTimePeriods(periods);

        setSelectedPeriod(periods[periods.length - 1]);
      } catch (error) {
        console.error("Failed to fetch time periods:", error);
      }
    };

    fetchTimePeriods();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      fetchDiscussions(selectedPeriod);
    }
  }, [selectedPeriod]);

  const fetchDiscussions = async (period) => {
    try {
      const response = await fetch(
        `/api/admin/discussions?startOfPeriod=${period.startOfPeriod}&endOfPeriod=${period.endOfPeriod}`
      );
      const data = await response.json();

      if (period === timePeriods[timePeriods.length - 1]) {
        setCurrentMonthDiscussions(data.currentMonthDiscussions);
        setLastMonthDiscussions(data.lastMonthDiscussions);
        setPercentageChange(data.percentageChange);
        setTrend(data.trend);
      }
      setMonthlyData(data.monthlyData);
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  const handlePeriodChange = (periodIndex) => {
    setSelectedPeriod(timePeriods[periodIndex]);
  };

  if (discussionsLoading) return <Loading />;

  return (
    <div className="p-4">
      {/* Display Cards with last and current month discussions data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-100">
          <CardHeader>
            <CardDescription>Total discussions last month</CardDescription>
            <CardTitle className="text-4xl">{lastMonthDiscussions}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-100">
          <CardHeader>
            <CardDescription>Total discussions this month</CardDescription>
            <CardTitle className="text-4xl">
              {currentMonthDiscussions}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-slate-100">
          <CardHeader>
            <CardDescription>Percentage change</CardDescription>
            <CardTitle className="text-4xl flex items-center">
              {percentageChange}%{" "}
              {trend === "increase" ? (
                <FaArrowUp className="text-green-500 ml-2" />
              ) : (
                <FaArrowUp className="text-red-500 ml-2 rotate-180" />
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Title and Period Selection Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Discussions Activity Over Time
        </h2>
        {timePeriods.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Select Period</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timePeriods.map((period, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => handlePeriodChange(index)}
                >
                  {new Date(period.startOfPeriod).toLocaleDateString("en-US", {
                    month: "long",
                  })}{" "}
                  -{" "}
                  {new Date(period.endOfPeriod).toLocaleDateString("en-US", {
                    month: "long",
                  })}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="cursor-default">
            {timePeriods.length === 1
              ? `${new Date(timePeriods[0].startOfPeriod).toLocaleDateString(
                  "en-US",
                  { month: "long" }
                )} - ${new Date(timePeriods[0].endOfPeriod).toLocaleDateString(
                  "en-US",
                  { month: "long" }
                )}`
              : "No periods available"}
          </Button>
        )}
      </div>

      {/* Chart Component */}
      <Charts monthlyData={monthlyData} />
    </div>
  );
};

export default Analytics;
