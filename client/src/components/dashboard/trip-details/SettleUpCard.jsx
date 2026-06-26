// src/components/dashboard/trip-details/SettleUpCard.jsx

import { useState } from "react";
import { useOptimizedSettlements, useSettlements, useProposeSettlement, useApproveSettlement } from "../../../hooks/useSettlements";
import useAuthStore from "../../../store/authStore";
import { FaCheckCircle, FaMoneyBillWave, FaCamera } from "react-icons/fa";

const SettleUpCard = ({ tripId, baseCurrency = "INR" }) => {
  const { user } = useAuthStore();
  const { data: optimized = [], isLoading: optimizedLoading } = useOptimizedSettlements(tripId);
  const { data: history = [] } = useSettlements(tripId);
  
  const proposeMutation = useProposeSettlement();
  const approveMutation = useApproveSettlement();

  const [activeTab, setActiveTab] = useState("optimize"); // optimize | history
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const handlePropose = (e) => {
    e.preventDefault();
    if (!selectedTransaction || !paymentAmount) return;

    const formData = new FormData();
    formData.append("paidBy", selectedTransaction.from.userId);
    formData.append("paidTo", selectedTransaction.to.userId);
    formData.append("amount", Number(paymentAmount));
    formData.append("currency", baseCurrency);
    
    if (receiptFile) {
      formData.append("receipt", receiptFile);
    }

    proposeMutation.mutate({
      tripId,
      payload: formData
    }, {
      onSuccess: () => {
        setSelectedTransaction(null);
        setPaymentAmount("");
        setReceiptFile(null);
      }
    });
  };

  const handleApprove = (settlementId) => {
    approveMutation.mutate({ tripId, settlementId });
  };

  if (optimizedLoading) {
    return <div className="p-6 border rounded-3xl animate-pulse bg-slate-50 h-64"></div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
          <FaMoneyBillWave className="text-emerald-500" /> Settle Up
        </h3>
        
        <div className="flex bg-slate-100 rounded-xl p-1">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "optimize" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}
            onClick={() => setActiveTab("optimize")}
          >
            Optimized
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "history" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === "optimize" && (
        <div>
          {optimized.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🎉
              </div>
              <h4 className="font-bold text-slate-800">All Settled Up!</h4>
              <p className="text-slate-500 text-sm mt-1">No pending debts in this trip.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">
                We've minimized the total number of peer-to-peer transfers required.
              </p>
              
              {optimized.map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                      {txn.from.name.charAt(0)}
                    </div>
                    <span className="text-slate-400 text-sm">pays</span>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      {txn.to.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <h4 className="font-bold text-slate-800">
                      {baseCurrency} {txn.amount.toFixed(2)}
                    </h4>
                    
                    {/* Only show Record button if current user is involved */}
                    {(user?.id === txn.from.userId || user?.id === txn.to.userId) && (
                      <button 
                        onClick={() => {
                          setSelectedTransaction(txn);
                          setPaymentAmount(txn.amount);
                        }}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-700 mt-1"
                      >
                        Record Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {history.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No settlement history yet.</p>
          ) : (
            history.map((settlement) => (
              <div key={settlement._id} className="p-4 border rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-slate-800">{settlement.paidBy.name}</span>
                    <span className="text-slate-500 mx-1">paid</span>
                    <span className="font-medium text-slate-800">{settlement.paidTo.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(settlement.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <h4 className="font-bold text-slate-800">
                    {settlement.currency} {settlement.amount.toFixed(2)}
                  </h4>
                  {settlement.proofImageUrl && (
                    <a 
                      href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000"}${settlement.proofImageUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-violet-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <FaCamera /> View Receipt
                    </a>
                  )}
                  {settlement.status === "Settled" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mt-1">
                      <FaCheckCircle /> Approved
                    </span>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md mt-1">
                        Pending
                      </span>
                      {(() => {
                        const currentUserId = user?.id?.toString() || user?._id?.toString();
                        const payerId = settlement.paidBy?._id?.toString() || settlement.paidBy?.toString();
                        const payeeId = settlement.paidTo?._id?.toString() || settlement.paidTo?.toString();
                        return (currentUserId === payeeId || currentUserId === payerId);
                      })() && (
                        <button 
                          onClick={() => handleApprove(settlement._id)}
                          disabled={approveMutation.isPending}
                          className="text-xs font-medium text-violet-600 mt-2 hover:underline"
                        >
                          Approve Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="font-bold text-2xl mb-2">Record Payment</h3>
            <p className="text-slate-500 text-sm mb-6">
              You are recording a payment from {selectedTransaction.from.name} to {selectedTransaction.to.name}.
            </p>

            <form onSubmit={handlePropose}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount ({baseCurrency})</label>
                <input 
                  type="number" 
                  step="0.01"
                  max={selectedTransaction.amount}
                  className="w-full border rounded-xl p-4 text-lg"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof (Optional)</label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 cursor-pointer transition ${receiptFile ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                  onClick={() => document.getElementById('receipt-upload').click()}
                >
                  <FaCamera className="text-3xl mb-2" />
                  <p className="text-sm font-medium">
                    {receiptFile ? receiptFile.name : "Click to upload receipt"}
                  </p>
                  <input 
                    type="file" 
                    id="receipt-upload"
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
                  className="flex-1 py-4 border rounded-xl font-medium"
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
                  className="flex-1 py-4 bg-violet-600 text-white rounded-xl font-medium disabled:opacity-50"
                >
                  {proposeMutation.isPending ? "Sending..." : "Submit Proof"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettleUpCard;
