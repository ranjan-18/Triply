// src/pages/dashboard/GlobalSettlementsPage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaExchangeAlt, FaCheckCircle, FaClock, FaCamera } from "react-icons/fa";
import { useGlobalSettlements, useGlobalOptimizedSettlements } from "../../hooks/useGlobalLedger";
import { useApproveSettlement, useProposeSettlement } from "../../hooks/useSettlements";
import moment from "moment";
import useAuthStore from "../../store/authStore";

const GlobalSettlementsPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("pending"); // pending | history
  
  const { data: history = [], isLoading: historyLoading } = useGlobalSettlements();
  const { data: optimized = [], isLoading: optimizedLoading } = useGlobalOptimizedSettlements();
  
  const approveMutation = useApproveSettlement();
  const proposeMutation = useProposeSettlement();

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const handlePropose = (e) => {
    e.preventDefault();
    if (!selectedTransaction || !paymentAmount) return;

    const formData = new FormData();
    formData.append("paidBy", selectedTransaction.transaction.from.userId);
    formData.append("paidTo", selectedTransaction.transaction.to.userId);
    formData.append("amount", Number(paymentAmount));
    formData.append("currency", selectedTransaction.baseCurrency);
    
    if (receiptFile) {
      formData.append("receipt", receiptFile);
    }

    proposeMutation.mutate({
      tripId: selectedTransaction.tripId,
      payload: formData
    }, {
      onSuccess: () => {
        setSelectedTransaction(null);
        setPaymentAmount("");
        setReceiptFile(null);
      }
    });
  };

  const handleApprove = (settlement) => {
    approveMutation.mutate({ 
      tripId: settlement.tripId._id, 
      settlementId: settlement._id 
    });
  };

  const isLoading = activeTab === "pending" ? optimizedLoading : historyLoading;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Settlements</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage all your pending and completed payments</p>
          </div>
          <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 text-3xl">
            <FaExchangeAlt />
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4 flex gap-2 bg-slate-50">
            <button 
              className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === "pending" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Balances
            </button>
            <button 
              className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === "history" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>

          {isLoading ? (
            <div className="p-10 space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl"></div>)}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* PENDING BALANCES TAB */}
              {activeTab === "pending" && (
                optimized.length === 0 ? (
                  <div className="p-20 text-center">
                    <FaCheckCircle className="text-6xl text-emerald-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700">All Settled Up!</h3>
                    <p className="text-slate-500 mt-2">You have no pending debts across any of your trips.</p>
                  </div>
                ) : (
                  optimized.map((item, idx) => {
                    const currentUserId = user?.id?.toString() || user?._id?.toString();
                    
                    const pendingSettlement = history.find(s => {
                      const sTripId = s.tripId?._id?.toString() || s.tripId?.toString();
                      const sPaidBy = s.paidBy?._id?.toString() || s.paidBy?.toString();
                      const sPaidTo = s.paidTo?._id?.toString() || s.paidTo?.toString();
                      
                      return s.status === "Pending" && 
                             sTripId === item.tripId?.toString() && 
                             sPaidBy === item.transaction.from.userId?.toString() && 
                             sPaidTo === item.transaction.to.userId?.toString();
                    });

                    return (
                    <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-4 sm:gap-5 w-full">
                        <div className="flex items-center -space-x-4 shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white relative z-10 bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm sm:text-base">
                            {item.transaction.from.name.charAt(0)}
                          </div>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white relative z-0 bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm sm:text-base">
                            {item.transaction.to.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                            {item.transaction.from.name} needs to pay {item.transaction.to.name}
                          </h4>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                            <span className="text-[10px] sm:text-xs px-2 py-1 rounded-md font-bold bg-orange-100 text-orange-700 flex items-center gap-1 shrink-0">
                              <FaClock /> Pending
                            </span>
                            <Link to={`/dashboard/trips/${item.tripId}`} className="text-xs sm:text-sm text-violet-600 hover:underline truncate max-w-full">
                              in {item.tripName}
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 shrink-0">
                          {item.baseCurrency} {item.transaction.amount.toFixed(2)}
                        </h3>
                        
                        {pendingSettlement ? (
                          currentUserId === item.transaction.to.userId?.toString() ? (
                            <button 
                              onClick={() => handleApprove(pendingSettlement)}
                              disabled={approveMutation.isPending}
                              className="bg-emerald-500 text-white text-sm sm:text-base font-semibold rounded-xl px-4 py-2 hover:bg-emerald-600 transition shadow-md disabled:opacity-50 whitespace-nowrap"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-xs sm:text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 whitespace-nowrap">
                              Awaiting Approval
                            </span>
                          )
                        ) : (
                          currentUserId === item.transaction.from.userId?.toString() && (
                            <button 
                              onClick={() => {
                                setSelectedTransaction(item);
                                setPaymentAmount(item.transaction.amount);
                              }}
                              className="bg-violet-600 text-white text-sm sm:text-base font-semibold rounded-xl px-4 py-2 hover:bg-violet-700 transition shadow-md whitespace-nowrap"
                            >
                              Record Payment
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )})
                )
              )}

              {/* HISTORY TAB */}
              {activeTab === "history" && (
                history.length === 0 ? (
                  <div className="p-20 text-center">
                    <FaExchangeAlt className="text-6xl text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700">No settlements yet</h3>
                    <p className="text-slate-500 mt-2">When you record or receive payments, they will appear here.</p>
                  </div>
                ) : (
                  history.map(settlement => {
                    const currentUserId = user?.id?.toString() || user?._id?.toString();
                    const payerId = settlement.paidBy?._id?.toString() || settlement.paidBy?.toString();
                    const payeeId = settlement.paidTo?._id?.toString() || settlement.paidTo?.toString();
                    
                    const canApprove = currentUserId === payeeId;
                    const isPending = settlement.status === "Pending";

                    return (
                      <div key={settlement._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4 sm:gap-5 w-full">
                          <div className="flex items-center -space-x-4 shrink-0">
                            <img 
                              src={settlement.paidBy.avatar || `https://ui-avatars.com/api/?name=${settlement.paidBy.name}&background=random`} 
                              alt="Payer" 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white relative z-10"
                            />
                            <img 
                              src={settlement.paidTo.avatar || `https://ui-avatars.com/api/?name=${settlement.paidTo.name}&background=random`} 
                              alt="Receiver" 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white relative z-0"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                              {settlement.paidBy.name} paid {settlement.paidTo.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                              <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 shrink-0 ${isPending ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {isPending ? <><FaClock /> Pending</> : <><FaCheckCircle /> Settled</>}
                              </span>
                              <span className="text-[10px] sm:text-sm text-slate-500 shrink-0">{moment(settlement.createdAt).fromNow()}</span>
                              {settlement.tripId && (
                                <Link to={`/dashboard/trips/${settlement.tripId._id}`} className="text-[10px] sm:text-sm text-violet-600 hover:underline truncate max-w-full">
                                  in {settlement.tripId.name}
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 gap-2">
                          <div className="flex flex-col items-start sm:items-end shrink-0">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                              {settlement.currency} {settlement.amount.toFixed(2)}
                            </h3>
                            {settlement.proofImageUrl && (
                              <a 
                                href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${settlement.proofImageUrl}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] sm:text-xs text-violet-600 hover:underline flex items-center gap-1 mt-1"
                              >
                                <FaCamera /> Receipt
                              </a>
                            )}
                          </div>
                          
                          {isPending && canApprove && (
                            <button 
                              onClick={() => handleApprove(settlement)}
                              disabled={approveMutation.isPending}
                              className="bg-emerald-500 text-white text-sm sm:text-base font-semibold rounded-xl px-4 py-2 hover:bg-emerald-600 transition shadow-md disabled:opacity-50 whitespace-nowrap"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          )}
        </div>

      </div>

      {/* Record Payment Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="font-bold text-2xl mb-2">Record Payment</h3>
            <p className="text-slate-500 text-sm mb-6">
              You are recording a payment from <span className="font-bold">{selectedTransaction.transaction.from.name}</span> to <span className="font-bold">{selectedTransaction.transaction.to.name}</span> in <span className="font-bold">{selectedTransaction.tripName}</span>.
            </p>

            <form onSubmit={handlePropose}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount ({selectedTransaction.baseCurrency})</label>
                <input 
                  type="number" 
                  step="0.01"
                  max={selectedTransaction.transaction.amount}
                  className="w-full border rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof (Optional)</label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 cursor-pointer transition ${receiptFile ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                  onClick={() => document.getElementById('global-receipt-upload').click()}
                >
                  <FaCamera className="text-3xl mb-2" />
                  <p className="text-sm font-medium">
                    {receiptFile ? receiptFile.name : "Click to upload receipt"}
                  </p>
                  <input 
                    type="file" 
                    id="global-receipt-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setReceiptFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  className="flex-1 py-4 border rounded-xl font-medium hover:bg-slate-50"
                  onClick={() => {
                    setSelectedTransaction(null);
                    setReceiptFile(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={proposeMutation.isPending}
                  className="flex-1 py-4 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50"
                >
                  {proposeMutation.isPending ? "Sending..." : "Submit Proof"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default GlobalSettlementsPage;
