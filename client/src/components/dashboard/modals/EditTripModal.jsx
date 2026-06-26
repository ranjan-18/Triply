// src/components/dashboard/modals/EditTripModal.jsx

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useUpdateTrip } from "../../../hooks/useUpdateTrip";

const EditTripModal = ({ trip, onClose }) => {
  const updateTripMutation = useUpdateTrip();

  const [formData, setFormData] = useState({
    title: trip?.title || "",
    destination: trip?.destination || "",
    budget: trip?.budget || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    updateTripMutation.mutate(
      {
        tripId: trip._id,
        payload: {
          title: formData.title,
          destination: formData.destination,
          budget: Number(formData.budget) || 0,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Trip</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Trip Name</label>
            <input
              type="text"
              placeholder="Trip Name"
              className="w-full border rounded-xl p-4 focus:outline-violet-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Destination</label>
            <input
              type="text"
              placeholder="Destination"
              className="w-full border rounded-xl p-4 focus:outline-violet-500"
              value={formData.destination}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destination: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Budget</label>
            <input
              type="number"
              placeholder="Budget"
              className="w-full border rounded-xl p-4 focus:outline-violet-500"
              value={formData.budget}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget: e.target.value,
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={updateTripMutation.isPending}
            className="w-full bg-violet-600 text-white py-4 rounded-xl font-medium hover:bg-violet-700 transition disabled:bg-violet-400 mt-2"
          >
            {updateTripMutation.isPending ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;