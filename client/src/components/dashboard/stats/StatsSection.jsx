import { useTrips } from "../../../hooks/useTrips";

const StatsSection = () => {
  const {
    data: trips = [],
  } = useTrips();

  const totalTrips =
    trips.length;

  const totalBudget =
    trips.reduce(
      (sum, trip) =>
        sum +
        (trip.budget || 0),
      0
    );

  return (
    <div
      className="
      grid
      md:grid-cols-2
      xl:grid-cols-4
      gap-6
    "
    >
      <div className="bg-white p-6 rounded-3xl">
        <h4>Total Trips</h4>

        <h2 className="text-4xl font-bold">
          {totalTrips}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-3xl">
        <h4>Total Budget</h4>

        <h2 className="text-4xl font-bold">
          ₹
          {totalBudget.toLocaleString()}
        </h2>
      </div>
    </div>
  );
};

export default StatsSection;