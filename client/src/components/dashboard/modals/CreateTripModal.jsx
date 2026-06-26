import { useState } from "react";
import { useCreateTrip } from "../../../hooks/useCreateTrip";

const CreateTripModal = ({ isOpen, onClose }) => {
  const createTripMutation = useCreateTrip();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    budget: "",
    baseCurrency: "INR",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // STRICTLY MATCH THE BACKEND VALIDATOR ROUTE SCHEMA
    const payload = {
      title: formData.title,
      destination: formData.destination,
      budget: Number(formData.budget) || 0,
      baseCurrency: formData.baseCurrency,
    };

    createTripMutation.mutate(payload, {
      onSuccess: () => {
        // Reset form inputs after successful creation
        setFormData({
          title: "",
          destination: "",
          budget: "",
          baseCurrency: "INR",
        });
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Create New Trip</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Trip Name"
            className="w-full border rounded-xl p-4"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            required
          />

          <input
            placeholder="Destination"
            className="w-full border rounded-xl p-4"
            value={formData.destination}
            onChange={(e) =>
              setFormData({
                ...formData,
                destination: e.target.value,
              })
            }
            required
          />

          <input
            type="number"
            placeholder="Budget"
            className="w-full border rounded-xl p-4"
            value={formData.budget}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget: e.target.value,
              })
            }
            required
          />

          <button
            type="submit"
            disabled={createTripMutation.isPending}
            className="w-full bg-violet-600 text-white py-4 rounded-xl font-medium hover:bg-violet-700 transition disabled:bg-violet-400"
          >
            {createTripMutation.isPending ? "Creating..." : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;