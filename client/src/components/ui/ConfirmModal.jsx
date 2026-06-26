import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isDestructive = true,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDestructive ? 'bg-red-100 text-red-500' : 'bg-violet-100 text-violet-500'}`}>
            <FaExclamationTriangle className="text-3xl" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 mb-8">{message}</p>
          
          <div className="flex gap-4 w-full">
            <button 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 font-semibold py-3 rounded-xl text-white transition shadow-lg disabled:opacity-50 ${isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/30'}`}
            >
              {isLoading ? "Loading..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
