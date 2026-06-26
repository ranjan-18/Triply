import ExpenseBreakdown from "./ExpenseBreakdown";
import MonthlyTrend from "./MonthlyTrend";

const ChartsSection = ({ tripId }) => {
  return (
    <div
      className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
      mt-6
    "
    >
      <ExpenseBreakdown tripId={tripId} />

      <MonthlyTrend tripId={tripId} />
    </div>
  );
};

export default ChartsSection;