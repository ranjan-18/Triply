import { useState, useEffect, useRef } from "react";
import { FaTimes, FaUtensils, FaCar, FaBed, FaEllipsisH, FaCamera, FaSpinner } from "react-icons/fa";
import { useCreateExpense } from "../../../hooks/useCreateExpense";
import { useEditExpense } from "../../../hooks/useEditExpense";
import { useScanReceipt } from "../../../hooks/useScanReceipt";
import useAuthStore from "../../../store/authStore";

const categories = [
  { label: "Food", icon: <FaUtensils /> },
  { label: "Transport", icon: <FaCar /> },
  { label: "Stay", icon: <FaBed /> },
  { label: "Other", icon: <FaEllipsisH /> },
];

const splitMethods = [
  { label: "Equally", value: "equal" },
  { label: "Unequally", value: "unequal" },
  { label: "By %", value: "percentage" },
  { label: "By Shares", value: "shares" },
];

const currencies = ["INR", "USD", "EUR", "GBP"];

const AddExpenseModal = ({ isOpen, onClose, trip, expenseToEdit }) => {
  const createExpenseMutation = useCreateExpense();
  const editExpenseMutation = useEditExpense(trip?._id);
  const scanReceiptMutation = useScanReceipt();
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    currency: "INR",
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    splitType: "equal",
  });

  const [splitValues, setSplitValues] = useState({});
  const [ocrResult, setOcrResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        amount: String(expenseToEdit.amountInBase || expenseToEdit.amount || ""), // Prefer base or original? Wait, edit uses the currency, so use expenseToEdit.amount!
        currency: expenseToEdit.currency || "INR",
        date: new Date(expenseToEdit.date || expenseToEdit.createdAt).toISOString().split("T")[0],
        category: expenseToEdit.category || "Food",
        splitType: expenseToEdit.splitType || "equal",
      });

      const initialSplits = {};
      trip?.members?.forEach((member) => {
        const existingSplit = expenseToEdit.splits?.find(s => s.userId?._id === member.userId._id || s.userId === member.userId._id);
        
        initialSplits[member.userId._id] = {
          included: expenseToEdit.splitType === "equal" ? !!existingSplit : true,
          value: existingSplit ? String(existingSplit.owedAmount) : "",
        };
      });
      setSplitValues(initialSplits);
    } else if (trip?.members) {
      const initialSplits = {};
      trip.members.forEach((member) => {
        initialSplits[member.userId._id] = {
          included: true,
          value: "", 
        };
      });
      setSplitValues(initialSplits);
      setOcrResult(null);
      
      setFormData((prev) => ({
        ...prev,
        title: "",
        amount: "",
        currency: trip?.baseCurrency || "INR",
        date: new Date().toISOString().split("T")[0],
        category: "Food",
        splitType: "equal",
      }));
    }
  }, [trip, isOpen, expenseToEdit]);

  if (!isOpen || !trip) return null;

  const handleScanReceipt = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    scanReceiptMutation.mutate(file, {
      onSuccess: (data) => {
        setOcrResult(data);
        if (data.amount || data.category) {
          setFormData(prev => ({
            ...prev,
            amount: data.amount ? String(data.amount) : prev.amount,
            category: data.category || prev.category
          }));
        }
      },
      onSettled: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleSplitValueChange = (userId, value) => {
    setSplitValues((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], value: value },
    }));
  };

  const toggleInclude = (userId) => {
    if (formData.splitType !== "equal") return;
    setSplitValues((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], included: !prev[userId].included },
    }));
  };

  const includedMembersCount = Object.values(splitValues).filter((s) => s.included).length;
  const amountNumber = Number(formData.amount) || 0;
  const perPersonAmount = includedMembersCount > 0 ? amountNumber / includedMembersCount : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    let splitsPayload = [];

    let currentSplitType = formData.splitType;

    if (currentSplitType === "equal") {
      splitsPayload = Object.entries(splitValues)
        .filter(([_, data]) => data.included)
        .map(([userId]) => ({ userId, value: 1 }));
        
      if (splitsPayload.length < trip.members.length) {
        currentSplitType = "shares";
      }
    } else {
      splitsPayload = Object.entries(splitValues)
        .filter(([_, data]) => data.value && Number(data.value) > 0)
        .map(([userId, data]) => ({ userId, value: Number(data.value) }));
    }

    const payload = {
      title: formData.title,
      amount: amountNumber,
      currency: formData.currency,
      date: formData.date,
      category: formData.category,
      splitType: currentSplitType,
      splits: splitsPayload,
    };

    if (expenseToEdit) {
      editExpenseMutation.mutate({ tripId: trip._id, expenseId: expenseToEdit._id, payload }, {
        onSuccess: () => onClose()
      });
    } else {
      createExpenseMutation.mutate({ tripId: trip._id, payload }, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = createExpenseMutation.isPending || editExpenseMutation.isPending;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-[32px] sm:rounded-[36px] rounded-b-none sm:rounded-b-[36px] w-full max-w-7xl p-5 sm:p-10 max-h-[92vh] sm:max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{expenseToEdit ? "Edit expense" : "Add expense"}</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              {expenseToEdit ? "Update expense details and splits" : "Add a new expense and split it with your group"}
            </p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleScanReceipt}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanReceiptMutation.isPending}
              className="flex-1 md:flex-none border border-violet-200 text-violet-700 bg-violet-50 rounded-2xl px-5 py-3 sm:px-6 sm:py-4 hover:bg-violet-100 transition flex items-center justify-center gap-2 font-semibold shadow-sm"
            >
              {scanReceiptMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaCamera />}
              {scanReceiptMutation.isPending ? "Scanning..." : "Scan Receipt"}
            </button>
            <button onClick={onClose} className="border border-slate-200 rounded-2xl p-3 sm:p-4 hover:bg-slate-50 transition shadow-sm bg-white text-slate-500 hover:text-slate-800">
              <FaTimes />
            </button>
          </div>
        </div>

        {ocrResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 flex justify-between items-center text-emerald-800">
            <div>
              <h4 className="font-bold flex items-center gap-2">✨ AI Extracted Data</h4>
              <p className="text-xs sm:text-sm mt-1">We found an amount of {formData.currency} {ocrResult.amount} and categorized it as {ocrResult.category}. Please verify and enter a title.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* LEFT PANEL */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">What was this for?</h3>
            <input
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-800 font-medium"
              placeholder="e.g. Dinner at restaurant"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <h3 className="font-semibold text-slate-700 mt-6 sm:mt-8 mb-2">Amount</h3>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-800 font-bold text-xl"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Currency</h3>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 outline-none focus:border-violet-500 focus:bg-white transition-all text-slate-800 font-medium appearance-none cursor-pointer"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Date</h3>
                <input
                  required
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 outline-none focus:border-violet-500 focus:bg-white transition-all text-slate-800 font-medium cursor-pointer"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Categories */}
            <h3 className="font-semibold text-slate-700 mt-6 sm:mt-8 mb-3">Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.label })}
                  className={`h-24 sm:h-32 border-2 rounded-2xl sm:rounded-[24px] flex flex-col justify-center items-center gap-2 sm:gap-3 transition-all duration-200 ${
                    formData.category === category.label
                      ? "border-violet-500 bg-violet-50/50 text-violet-700 shadow-[0_0_20px_rgba(139,92,246,0.15)] scale-[1.02]"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <div className="text-xl sm:text-2xl">{category.icon}</div>
                  <span className="font-medium text-sm sm:text-base">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Split Method */}
            <h3 className="font-semibold text-slate-700 mt-6 sm:mt-8 mb-3">Split Method</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100/80 border border-slate-200/60 rounded-2xl p-1 gap-1">
              {splitMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  className={`py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 ${
                    formData.splitType === method.value
                      ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                  }`}
                  onClick={() => setFormData({ ...formData, splitType: method.value })}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="border-2 border-slate-100 bg-slate-50/30 rounded-[24px] sm:rounded-[32px] p-4 sm:p-7 flex flex-col shadow-[inset_0_2px_20px_rgba(0,0,0,0.01)] h-[500px] lg:h-auto overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <h3 className="font-bold text-xl sm:text-2xl text-slate-800">
                  {formData.splitType === "equal" && "Split equally"}
                  {formData.splitType === "unequal" && "Split exact amounts"}
                  {formData.splitType === "percentage" && "Split by percentage"}
                  {formData.splitType === "shares" && "Split by shares"}
                </h3>
                <p className="text-slate-500 text-sm sm:text-base">
                  {formData.splitType === "equal" && "Select who to include"}
                  {formData.splitType === "unequal" && "Enter exact amount for each person"}
                  {formData.splitType === "percentage" && "Enter percentage for each person"}
                  {formData.splitType === "shares" && "Enter share units for each person"}
                </p>
              </div>
            </div>

            {formData.splitType === "equal" && (
              <div className="bg-emerald-50 border border-emerald-100/50 rounded-2xl p-4 sm:p-5 flex justify-between items-center mb-6 flex-shrink-0">
                <p className="text-emerald-700 font-semibold text-sm sm:text-base">Each pays</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {formData.currency} {perPersonAmount.toFixed(2)}
                </h2>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-2 pb-2">
              {(trip?.members || []).map((member) => {
                const userId = member.userId._id;
                const splitData = splitValues[userId] || {};
                const isChecked = splitData.included;

                return (
                  <div
                    key={userId}
                    className={`flex items-center justify-between rounded-2xl p-3 sm:p-4 border-2 transition-all duration-200 ${
                      formData.splitType === "equal"
                        ? isChecked ? "border-violet-200 bg-violet-50/50 cursor-pointer" : "border-slate-100 bg-white opacity-60 hover:opacity-100 cursor-pointer"
                        : "border-slate-100 bg-white"
                    }`}
                    onClick={() => toggleInclude(userId)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {formData.splitType === "equal" && (
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isChecked ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300 bg-white"}`}>
                          {isChecked && <span className="text-xs sm:text-sm">✓</span>}
                        </div>
                      )}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-700 font-bold border border-violet-200/50">
                        {member.userId.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-800">
                          {member.userId.name} {user?.id === userId && <span className="text-violet-600 font-semibold">(You)</span>}
                        </h4>
                        {formData.splitType === "equal" && (
                          <p className="text-slate-400 font-medium text-[10px] sm:text-xs uppercase tracking-wider">{isChecked ? "Included" : "Excluded"}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right" onClick={(e) => e.stopPropagation()}>
                      {formData.splitType === "equal" ? (
                        isChecked ? (
                          <h3 className="font-bold text-base sm:text-lg text-slate-800">{formData.currency} {perPersonAmount.toFixed(2)}</h3>
                        ) : (
                          <p className="text-slate-400 font-medium text-sm">Excluded</p>
                        )
                      ) : (
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          {formData.splitType === "unequal" && <span className="text-slate-400 font-medium">{formData.currency}</span>}
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            className="w-20 sm:w-24 bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-3 text-right outline-none focus:border-violet-500 focus:bg-white transition-all font-semibold"
                            value={splitData.value}
                            onChange={(e) => handleSplitValueChange(userId, e.target.value)}
                          />
                          {formData.splitType === "percentage" && <span className="text-slate-400 font-medium">%</span>}
                          {formData.splitType === "shares" && <span className="text-slate-400 font-medium text-sm">shares</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.splitType === "percentage" && (
              <div className="mt-4 text-xs sm:text-sm font-semibold text-slate-500 text-center flex-shrink-0 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">Total: <span className="text-violet-600 text-base">{Object.values(splitValues).reduce((sum, s) => sum + Number(s.value || 0), 0)}%</span></div>
            )}
            {formData.splitType === "unequal" && (
              <div className="mt-4 text-xs sm:text-sm font-semibold text-slate-500 text-center flex-shrink-0 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">Total Entered: <span className="text-violet-600 text-base">{formData.currency} {Object.values(splitValues).reduce((sum, s) => sum + Number(s.value || 0), 0)}</span></div>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-4 sm:mt-8 border-t border-slate-200 pt-6 sm:pt-8">
            <div className="w-full sm:w-auto text-center sm:text-left">
              <p className="text-slate-500 font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">Total Expense</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{formData.currency} {amountNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button type="button" onClick={onClose} className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-2xl px-8 py-4 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all focus:outline-none focus:ring-4 focus:ring-slate-100">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !formData.title || !formData.amount}
                className="w-full sm:w-auto bg-violet-600 text-white font-bold rounded-2xl px-8 py-4 hover:bg-violet-700 transition-all disabled:opacity-50 disabled:hover:bg-violet-600 shadow-[0_8px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_12px_25px_rgba(139,92,246,0.4)] disabled:shadow-none translate-y-0 hover:-translate-y-0.5 disabled:translate-y-0 focus:outline-none focus:ring-4 focus:ring-violet-500/30"
              >
                {isPending ? "Saving..." : (expenseToEdit ? "Save Changes" : "Add Expense")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;