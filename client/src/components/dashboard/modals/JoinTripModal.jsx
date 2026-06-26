// src/components/dashboard/modals/JoinTripModal.jsx

import { useState } from "react";
import { FaTicketAlt, FaTimes } from "react-icons/fa";
import { useJoinTrip } from "../../../hooks/useJoinTrip";

/**
 * Modal for joining a trip by invite code.
 * Closes automatically on successful join.
 *
 * @param {{ isOpen: boolean, onClose: Function }} props
 */
const JoinTripModal = ({ isOpen, onClose }) => {
  const joinTripMutation = useJoinTrip();
  const [inviteCode, setInviteCode] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    joinTripMutation.mutate(inviteCode.trim(), {
      onSuccess: () => {
        setInviteCode("");
        onClose();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-3">
              <FaTicketAlt className="text-violet-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Join a Trip</h2>
            <p className="text-slate-500 text-sm mt-1">
              Enter the invite code shared by your trip organizer
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="e.g. aB3xY7kL"
            className="w-full border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-violet-500 transition text-center text-lg tracking-widest font-mono"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            maxLength={8}
            required
          />

          <button
            type="submit"
            disabled={joinTripMutation.isPending || !inviteCode.trim()}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white py-4 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {joinTripMutation.isPending ? "Joining..." : "Join Trip →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinTripModal;