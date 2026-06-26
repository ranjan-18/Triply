import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useExpenses } from "../../../hooks/useExpenses";

const COLORS = [
  "#8B5CF6",
  "#A855F7",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
];

const ExpenseBreakdown = ({
  tripId,
}) => {
  const {
    data: expenses = [],
    isLoading,
  } = useExpenses(tripId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6">
        Loading...
      </div>
    );
  }

  const categoryMap = {};

  expenses.forEach(
    (expense) => {
      const category =
        expense.category ||
        "Other";

      categoryMap[category] =
        (categoryMap[
          category
        ] || 0) +
        expense.amount;
    }
  );

  const chartData =
    Object.entries(
      categoryMap
    ).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Expense Breakdown
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          >
            {chartData.map(
              (_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBreakdown;