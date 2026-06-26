import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useExpenses } from "../../../hooks/useExpenses";

const MonthlyTrend = ({
  tripId,
}) => {
  const {
    data: expenses = [],
  } = useExpenses(tripId);

  const monthlyMap = {};

  expenses.forEach(
    (expense) => {
      const month =
        new Date(
          expense.createdAt
        ).toLocaleString(
          "default",
          {
            month: "short",
          }
        );

      monthlyMap[month] =
        (monthlyMap[
          month
        ] || 0) +
        expense.amount;
    }
  );

  const chartData =
    Object.entries(
      monthlyMap
    ).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Monthly Spending Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart
          data={chartData}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8B5CF6"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrend;