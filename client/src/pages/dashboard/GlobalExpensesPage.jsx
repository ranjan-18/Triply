// src/pages/dashboard/GlobalExpensesPage.jsx

import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaReceipt, FaUtensils, FaCar, FaBed, FaEllipsisH } from "react-icons/fa";
import { useGlobalExpenses } from "../../hooks/useGlobalLedger";
import moment from "moment";
import useAuthStore from "../../store/authStore";

const getCategoryIcon = (category) => {
  switch (category) {
    case "Food": return <FaUtensils />;
    case "Transport": return <FaCar />;
    case "Stay": return <FaBed />;
    default: return <FaEllipsisH />;
  }
};

const GlobalExpensesPage = () => {
  const { user } = useAuthStore();
  const { data: expenses = [], isLoading } = useGlobalExpenses();

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">All Expenses</h1>
            <p className="text-slate-500 mt-2 text-lg">A master ledger of your spending across all trips</p>
          </div>
          <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 text-3xl">
            <FaReceipt />
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-10 space-y-4 animate-pulse">
              {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl"></div>)}
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-20 text-center">
              <FaReceipt className="text-6xl text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No expenses found</h3>
              <p className="text-slate-500 mt-2">You haven't added or been included in any expenses yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {expenses.map(expense => {
                const isPayer = expense.paidBy._id === user?.id;
                
                // Calculate how much user owes or is owed for this specific expense
                let userSplit = expense.splits.find(s => s.userId._id === user?.id);
                let displayAmountText = "";
                let amountColor = "";

                if (isPayer) {
                  // User paid. They are owed (Total - Their Share)
                  const theirShare = userSplit ? userSplit.owedAmount : 0;
                  const owedToUser = expense.amount - theirShare;
                  if (owedToUser > 0) {
                    displayAmountText = `You lent ${expense.currency} ${owedToUser.toFixed(2)}`;
                    amountColor = "text-emerald-600";
                  } else {
                    displayAmountText = `You paid ${expense.currency} ${expense.amount.toFixed(2)}`;
                    amountColor = "text-slate-600";
                  }
                } else {
                  // User didn't pay. They owe their split.
                  if (userSplit) {
                    displayAmountText = `You borrowed ${expense.currency} ${userSplit.owedAmount.toFixed(2)}`;
                    amountColor = "text-orange-600";
                  } else {
                    displayAmountText = `Not involved`;
                    amountColor = "text-slate-400";
                  }
                }

                return (
                  <div key={expense._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-sm border border-blue-100">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{expense.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <span>{moment(expense.date).format("MMM DD, YYYY")}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            Paid by <b className="text-slate-700">{isPayer ? "You" : expense.paidBy.name}</b>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <p className={`font-bold ${amountColor}`}>{displayAmountText}</p>
                        <p className="text-xs text-slate-400 mt-1">Total: {expense.currency} {expense.amount.toFixed(2)}</p>
                      </div>
                      
                      <Link 
                        to={`/dashboard/trips/${expense.tripId?._id}`}
                        className="text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-2 rounded-xl hover:bg-violet-100 transition whitespace-nowrap"
                      >
                        View Trip
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default GlobalExpensesPage;
