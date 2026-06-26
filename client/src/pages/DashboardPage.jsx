import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

import StatsSection from "../components/dashboard/stats/StatsSection";
import ChartsSection from "../components/dashboard/charts/ChartsSection";

import TripsSection from "../components/dashboard/trips/TripsSection";
import RecentActivity from "../components/dashboard/activity/RecentActivity";

import FloatingButton from "../components/dashboard/actions/FloatingButton";

import CreateTripModal from "../components/dashboard/modals/CreateTripModal";
import JoinTripModal from "../components/dashboard/modals/JoinTripModal";

import { useTrips } from "../hooks/useTrips";

const DashboardPage = () => {
  const [openCreateTrip, setOpenCreateTrip] =
    useState(false);

  const [openJoinTrip, setOpenJoinTrip] =
    useState(false);

  const {
    data: trips = [],
    isLoading,
    isError,
  } = useTrips();

  const selectedTripId =
    trips.length > 0
      ? trips[0]._id
      : null;

  if (isLoading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        font-semibold
      "
      >
        Loading Dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-red-500
        text-xl
      "
      >
        Failed to load dashboard
      </div>
    );
  }

  return (
    <>
      <DashboardLayout
        sidebar={<Sidebar />}
        navbar={
          <DashboardNavbar
            onCreateTrip={() =>
              setOpenCreateTrip(true)
            }
          />
        }
      >
        {/* Stats */}
        <StatsSection />

        {/* Charts */}
        {selectedTripId && (
          <div className="mt-6">
            <ChartsSection
              tripId={selectedTripId}
            />
          </div>
        )}

        {/* Trips + Activity */}
        <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-6
        "
        >
          <TripsSection />

          <RecentActivity tripId={selectedTripId} />
        </div>
      </DashboardLayout>

      <FloatingButton
        onClick={() =>
          setOpenJoinTrip(true)
        }
      />

      <CreateTripModal
        isOpen={openCreateTrip}
        onClose={() =>
          setOpenCreateTrip(false)
        }
      />

      <JoinTripModal
        isOpen={openJoinTrip}
        onClose={() =>
          setOpenJoinTrip(false)
        }
      />
    </>
  );
};

export default DashboardPage;