// src/pages/TripDetailsPage.jsx

import { useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import DashboardNavbar from "../components/dashboard/navbar/DashboardNavbar";

import TripHeader from "../components/dashboard/trip-details/TripHeader";
import TripStats from "../components/dashboard/trip-details/TripStats";
import BalanceSummary from "../components/dashboard/trip-details/BalanceSummary";
import ExpenseList from "../components/dashboard/trip-details/ExpenseList";
import AnalyticsSection from "../components/dashboard/trip-details/AnalyticsSection";
import SettleUpCard from "../components/dashboard/trip-details/SettleUpCard";
import LiveFeed from "../components/dashboard/trip-details/LiveFeed";

import AddExpenseModal from "../components/dashboard/expenses/AddExpenseModal";

import { useTrip } from "../hooks/useTrip";
import { useExpenses } from "../hooks/useExpenses";
import { useBalances } from "../hooks/useBalances";
import useAuthStore from "../store/authStore";

/**
 * Trip detail page — shows header, stats, balance summary, expense list and analytics.
 */
const TripDetailsPage = () => {
  const { tripId } = useParams();

  // NOTE: Auth service returns { id, name, email, avatar } — NOT { _id }
  const { user } = useAuthStore();

  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const { data: trip, isLoading: tripLoading } = useTrip(tripId);
  const { data: expenses = [] } = useExpenses(tripId);
  const { data: balances = [] } = useBalances(tripId);

  // Total spent = sum of all expense amounts
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Find the current user's balance entry.
  // The balance userId is a MongoDB ObjectId string.
  // The stored user.id is the string from the JWT payload.
  const myBalance = balances.find((b) => {
    const balanceUserId =
      b.userId?._id?.toString() ?? b.userId?.toString() ?? "";
    const currentUserId = user?.id?.toString() ?? "";
    return balanceUserId === currentUserId;
  });

  const myNetBalance = myBalance?.netBalance ?? 0;

  const handleEditExpense = (expense) => {
    setExpenseToEdit(expense);
    setOpenExpenseModal(true);
  };

  const handleCloseExpenseModal = () => {
    setOpenExpenseModal(false);
    // Add a small delay before clearing the state to allow the modal close animation to finish
    setTimeout(() => setExpenseToEdit(null), 300);
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading trip...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardLayout
        sidebar={<Sidebar />}
        navbar={<DashboardNavbar />}
      >
        <TripHeader
          trip={trip}
          onAddExpense={() => setOpenExpenseModal(true)}
        />

        <TripStats
          totalSpent={totalSpent}
          owe={myNetBalance < 0 ? Math.abs(myNetBalance) : 0}
          getBack={myNetBalance > 0 ? myNetBalance : 0}
          members={trip?.members?.length || 0}
        />

        <BalanceSummary tripId={tripId} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            <ExpenseList
              tripId={tripId}
              onAddExpense={() => setOpenExpenseModal(true)}
              onEditExpense={handleEditExpense}
            />
          </div>

          <div className="flex flex-col gap-6">
            <SettleUpCard tripId={tripId} baseCurrency={trip?.baseCurrency} />
            <AnalyticsSection tripId={tripId} />
            <LiveFeed tripId={tripId} />
          </div>
        </div>
      </DashboardLayout>

      <AddExpenseModal
        isOpen={openExpenseModal}
        onClose={handleCloseExpenseModal}
        trip={trip}
        expenseToEdit={expenseToEdit}
      />
    </>
  );
};

export default TripDetailsPage;
