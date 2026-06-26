import { useState } from "react";
import TripCard from "./TripCards";
import EditTripModal from "../modals/EditTripModal";

import { useTrips } from "../../../hooks/useTrips";
import { useDeleteTrip } from "../../../hooks/useDeleteTrip";
import { useLeaveTrip } from "../../../hooks/useLeaveTrip";

import toast from "react-hot-toast";

const TripsSection = () => {
  const { data: trips = [] } =
    useTrips();

  const deleteTrip =
    useDeleteTrip();

  const leaveTrip =
    useLeaveTrip();

  const [selectedTrip, setSelectedTrip] =
    useState(null);

  const handleDelete =
    async (tripId) => {
      try {
        await deleteTrip.mutateAsync(
          tripId
        );

        toast.success(
          "Trip deleted successfully"
        );
      } catch (error) {
        toast.error(
          "Failed to delete trip"
        );
      }
    };

  const handleLeave =
    async (tripId) => {
      try {
        await leaveTrip.mutateAsync(
          tripId
        );

        toast.success(
          "Left trip successfully"
        );
      } catch (error) {
        toast.error(
          "Failed to leave trip"
        );
      }
    };

  const handleEdit = (
    trip
  ) => {
    setSelectedTrip(trip);
  };

  return (
    <>
      <div className="space-y-5">
        {trips.map((trip) => (
          <TripCard
            key={trip._id}
            trip={trip}
            onEdit={
              handleEdit
            }
            onDelete={
              handleDelete
            }
            onLeave={
              handleLeave
            }
          />
        ))}
      </div>

      {selectedTrip && (
        <EditTripModal
          trip={selectedTrip}
          onClose={() =>
            setSelectedTrip(null)
          }
        />
      )}
    </>
  );
};

export default TripsSection;