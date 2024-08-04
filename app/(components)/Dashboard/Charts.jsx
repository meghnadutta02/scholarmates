import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const Charts = ({ monthlyData }) => {
  const chartConfig = {
    month: {
      label: "Month",
      color: "#3f3f46",
    },
  };
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[300px] w-full mb-8"
    >
      <BarChart data={monthlyData} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis
          dataKey="discussions"
          label={{
            value: "Discussions",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: "14px" },
          }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="discussions" fill="var(--color-month)" />
      </BarChart>
    </ChartContainer>
  );
};

export default Charts;
