"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const fetchDiscussions = async () => {
    try {
      const response = await fetch("/api/admin/discussions");
      const data = await response.json();
      setCurrentMonthDiscussions(data.currentMonthDiscussions);
      setLastMonthDiscussions(data.lastMonthDiscussions);
      setPercentageChange(data.percentageChange);
      setTrend(data.trend);
      setMonthlyData(data.monthlyData);
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDiscussions();
    };

    fetchData();
  }, []);

  if (discussionsLoading) return <Loading />;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card x-chunk="dashboard-05-chunk-1" className="bg-slate-100">
          <CardHeader>
            <CardDescription>Total discussions last month</CardDescription>
            <CardTitle className="text-4xl">{lastMonthDiscussions}</CardTitle>
          </CardHeader>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2" className="bg-slate-100">
          <CardHeader>
            <CardDescription>Total discussions this month</CardDescription>
            <CardTitle className="text-4xl">
              {currentMonthDiscussions}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card x-chunk="dashboard-05-chunk-3" className="bg-slate-100">
          <CardHeader>
            <CardDescription>Percentage change</CardDescription>
            <CardTitle className="text-4xl flex gap-2 items-center">
              {`${percentageChange}%`}
              {trend === "increase" ? (
                <FaArrowUp className="text-green-500 text-2xl " />
              ) : (
                <FaArrowUp className="text-red-500 text-2xl rotate-180" />
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="text-xl font-semibold mb-2 text-center">
        Discussion Activity Over the Past 6 Months
      </div>
      <Charts monthlyData={monthlyData} />
    </div>
  );
};

export default Analytics;
