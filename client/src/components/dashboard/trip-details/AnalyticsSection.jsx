import ExpenseBreakdown from "../charts/ExpenseBreakdown";
import MonthlyTrend from "../charts/MonthlyTrend";

const AnalyticsSection = ({
tripId,
}) => {
return ( <div className="space-y-6"> <ExpenseBreakdown
     tripId={tripId}
   />

  <MonthlyTrend
    tripId={tripId}
  />
</div>

);
};

export default AnalyticsSection;
