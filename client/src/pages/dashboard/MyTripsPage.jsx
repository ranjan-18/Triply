// src/pages/dashboard/MyTripsPage.jsx

import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaSuitcase, FaPlus } from "react-icons/fa";
import { useTrips } from "../../hooks/useTrips";

import TripCard from "../../components/dashboard/trips/TripCards";
import EditTripModal from "../../components/dashboard/modals/EditTripModal";
import CreateTripModal from "../../components/dashboard/modals/CreateTripModal";
import JoinTripModal from "../../components/dashboard/modals/JoinTripModal";
import FloatingButton from "../../components/dashboard/actions/FloatingButton";

import { useDeleteTrip } from "../../hooks/useDeleteTrip";
import { useLeaveTrip } from "../../hooks/useLeaveTrip";
import toast from "react-hot-toast";

const MyTripsPage = () => {
  const { data: trips = [], isLoading, isError } = useTrips();
  const deleteTrip = useDeleteTrip();
  const leaveTrip = useLeaveTrip();

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [openCreateTrip, setOpenCreateTrip] = useState(false);
  const [openJoinTrip, setOpenJoinTrip] = useState(false);

  const handleDelete = async (tripId) => {
    try {
      await deleteTrip.mutateAsync(tripId);
      toast.success("Trip deleted successfully");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  const handleLeave = async (tripId) => {
    try {
      await leaveTrip.mutateAsync(tripId);
      toast.success("Left trip successfully");
    } catch (error) {
      toast.error("Failed to leave trip");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Loading your trips...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
              <FaSuitcase className="text-violet-600" /> My Trips
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Manage and view all your travel adventures</p>
          </div>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-slate-200 p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-violet-50 text-violet-300 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
              <FaSuitcase />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No trips found</h3>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              You haven't created or joined any trips yet. Start your first adventure now!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setOpenCreateTrip(true)}
                className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-700 transition"
              >
                Create a Trip
              </button>
              <button 
                onClick={() => setOpenJoinTrip(true)}
                className="bg-emerald-100 text-emerald-700 px-8 py-3 rounded-xl font-bold hover:bg-emerald-200 transition"
              >
                Join with Code
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onEdit={setSelectedTrip}
                onDelete={handleDelete}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}

      </div>

      <FloatingButton onClick={() => setOpenJoinTrip(true)} />

      <CreateTripModal
        isOpen={openCreateTrip}
        onClose={() => setOpenCreateTrip(false)}
      />

      <JoinTripModal
        isOpen={openJoinTrip}
        onClose={() => setOpenJoinTrip(false)}
      />

      {selectedTrip && (
        <EditTripModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default MyTripsPage;
