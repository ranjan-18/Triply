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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-[36px] w-full max-w-7xl p-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">{expenseToEdit ? "Edit expense" : "Add expense"}</h2>
            <p className="text-slate-500 mt-2">
              {expenseToEdit ? "Update expense details and splits" : "Add a new expense and split it with your group"}
            </p>
          </div>
          
          <div className="flex gap-4">
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
              className="border-2 border-violet-200 text-violet-700 bg-violet-50 rounded-2xl px-6 py-4 hover:bg-violet-100 transition flex items-center gap-2 font-semibold"
            >
              {scanReceiptMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaCamera />}
              {scanReceiptMutation.isPending ? "Scanning..." : "Scan Receipt"}
            </button>
            <button onClick={onClose} className="border rounded-2xl p-5 hover:bg-slate-50 transition">
              <FaTimes />
            </button>
          </div>
        </div>

        {ocrResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex justify-between items-center text-emerald-800">
            <div>
              <h4 className="font-bold flex items-center gap-2">✨ AI Extracted Data</h4>
              <p className="text-sm mt-1">We found an amount of {formData.currency} {ocrResult.amount} and categorized it as {ocrResult.category}. Please verify and enter a title.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* LEFT PANEL */}
          <div>
            <h3 className="font-semibold mb-3">What was this for?</h3>
            <input
              required
              className="w-full border rounded-2xl p-5 outline-none focus:border-violet-500"
              placeholder="Dinner at restaurant"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <h3 className="font-semibold mt-8 mb-3">Amount</h3>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              className="w-full border rounded-2xl p-5 outline-none focus:border-violet-500"
              placeholder="4200"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <h3 className="font-semibold mb-3">Currency</h3>
                <select
                  className="w-full border rounded-2xl p-5 outline-none focus:border-violet-500"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Date</h3>
                <input
                  required
                  type="date"
                  className="w-full border rounded-2xl p-5 outline-none focus:border-violet-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Categories */}
            <h3 className="font-semibold mt-8 mb-4">Category</h3>
            <div className="grid grid-cols-4 gap-4">
              {categories.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.label })}
                  className={`h-32 border rounded-3xl flex flex-col justify-center items-center gap-3 transition ${
                    formData.category === category.label
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="text-2xl">{category.icon}</div>
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>

            {/* Split Method */}
            <h3 className="font-semibold mt-8 mb-4">Split Method</h3>
            <div className="grid grid-cols-4 border rounded-2xl overflow-hidden font-medium">
              {splitMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  className={`py-4 transition ${
                    formData.splitType === method.value
                      ? "bg-violet-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50 border-r last:border-none"
                  }`}
                  onClick={() => setFormData({ ...formData, splitType: method.value })}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="border border-slate-200 rounded-[32px] p-7 shadow-sm flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <h3 className="font-bold text-2xl text-slate-800">
                  {formData.splitType === "equal" && "Split equally"}
                  {formData.splitType === "unequal" && "Split exact amounts"}
                  {formData.splitType === "percentage" && "Split by percentage"}
                  {formData.splitType === "shares" && "Split by shares"}
                </h3>
                <p className="text-slate-500">
                  {formData.splitType === "equal" && "Select who to include"}
                  {formData.splitType === "unequal" && "Enter exact amount for each person"}
                  {formData.splitType === "percentage" && "Enter percentage for each person"}
                  {formData.splitType === "shares" && "Enter share units for each person"}
                </p>
              </div>
            </div>

            {formData.splitType === "equal" && (
              <div className="bg-emerald-50 rounded-2xl p-5 flex justify-between items-center mb-8">
                <p className="text-emerald-700 font-medium">Each included person pays</p>
                <h2 className="text-3xl font-bold text-emerald-600">
                  {formData.currency} {perPersonAmount.toFixed(2)}
                </h2>
              </div>
            )}

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {(trip?.members || []).map((member) => {
                const userId = member.userId._id;
                const splitData = splitValues[userId] || {};
                const isChecked = splitData.included;

                return (
                  <div
                    key={userId}
                    className={`flex items-center justify-between rounded-2xl p-4 border transition-all ${
                      formData.splitType === "equal"
                        ? isChecked ? "border-violet-300 bg-violet-50 cursor-pointer" : "border-slate-200 bg-white opacity-60 hover:opacity-100 cursor-pointer"
                        : "border-slate-200 bg-white"
                    }`}
                    onClick={() => toggleInclude(userId)}
                  >
                    <div className="flex items-center gap-4">
                      {formData.splitType === "equal" && (
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${isChecked ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300"}`}>
                          {isChecked && "✓"}
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-violet-700 font-bold">
                        {member.userId.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {member.userId.name} {user?.id === userId && "(You)"}
                        </h4>
                        {formData.splitType === "equal" && (
                          <p className="text-slate-500 text-xs">{isChecked ? "Included" : "Excluded"}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right" onClick={(e) => e.stopPropagation()}>
                      {formData.splitType === "equal" ? (
                        isChecked ? (
                          <h3 className="font-bold text-lg text-slate-800">{formData.currency} {perPersonAmount.toFixed(2)}</h3>
                        ) : (
                          <p className="text-slate-400 font-medium">Excluded</p>
                        )
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {formData.splitType === "unequal" && <span className="text-slate-400">{formData.currency}</span>}
                          <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            className="w-24 border rounded-xl p-2 text-right outline-none focus:border-violet-500"
                            value={splitData.value}
                            onChange={(e) => handleSplitValueChange(userId, e.target.value)}
                          />
                          {formData.splitType === "percentage" && <span className="text-slate-400">%</span>}
                          {formData.splitType === "shares" && <span className="text-slate-400 text-sm">shares</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.splitType === "percentage" && (
              <div className="mt-4 text-sm text-center">Total: {Object.values(splitValues).reduce((sum, s) => sum + Number(s.value || 0), 0)}%</div>
            )}
            {formData.splitType === "unequal" && (
              <div className="mt-4 text-sm text-center">Total Entered: {formData.currency} {Object.values(splitValues).reduce((sum, s) => sum + Number(s.value || 0), 0)}</div>
            )}
          </div>

          <div className="lg:col-span-2 flex items-center justify-between mt-4 border-t pt-8">
            <div>
              <p className="text-slate-500 font-medium">Total Expense Amount</p>
              <h3 className="text-4xl font-bold text-slate-900">{formData.currency} {amountNumber.toLocaleString()}</h3>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="border border-slate-200 text-slate-600 font-semibold rounded-2xl px-10 py-4 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !formData.title || !formData.amount}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl px-10 py-4 hover:opacity-90 transition disabled:opacity-50 shadow-lg"
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