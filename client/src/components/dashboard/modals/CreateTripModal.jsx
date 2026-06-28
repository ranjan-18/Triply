import { useState } from "react";
import { useCreateTrip } from "../../../hooks/useCreateTrip";
import { useGetFriends } from "../../../hooks/useFriends";
import { FaTimes, FaGlobe, FaRupeeSign, FaSuitcase, FaUsers } from "react-icons/fa";

const CreateTripModal = ({ isOpen, onClose }) => {
  const createTripMutation = useCreateTrip();
  const { data: friendsData = [] } = useGetFriends();

  // Handle both possible structures of friendsData depending on useFriends implementation
  const friendsList = friendsData?.data?.friends || friendsData?.friends || [];

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    budget: "",
    baseCurrency: "INR",
  });
  const [selectedFriends, setSelectedFriends] = useState([]);

  if (!isOpen) return null;

  const toggleFriend = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      destination: formData.destination,
      budget: Number(formData.budget) || 0,
      baseCurrency: formData.baseCurrency,
      friends: selectedFriends,
    };

    createTripMutation.mutate(payload, {
      onSuccess: () => {
        setFormData({
          title: "",
          destination: "",
          budget: "",
          baseCurrency: "INR",
        });
        setSelectedFriends([]);
        onClose();
      },
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-[32px] sm:rounded-[36px] rounded-b-none sm:rounded-b-[36px] w-full max-w-2xl p-5 sm:p-10 max-h-[92vh] sm:max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden shrink-0" />
        
        <div className="flex justify-between items-start mb-6 sm:mb-8 shrink-0">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Create Trip</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Start a new adventure and invite your friends</p>
          </div>
          <button onClick={onClose} className="p-3 sm:p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition text-slate-500">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2 pb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Trip Name</label>
              <div className="relative">
                <FaSuitcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  placeholder="e.g. Summer in Paris"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-800 font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Destination</label>
              <div className="relative">
                <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  placeholder="e.g. Paris, France"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-800 font-medium"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Budget</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-800 font-medium"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Currency</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-slate-800 font-medium"
                  value={formData.baseCurrency}
                  onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <FaUsers className="text-violet-600" /> Add Friends to Trip
            </label>
            
            {friendsList.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <p className="text-sm text-slate-500">You don't have any friends yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                {friendsList.map((friendship) => {
                  // Depending on the API, the friend object might be populated in 'friend' or 'userId'
                  // Usually, it's populated in 'friend' for a friends list
                  const friend = friendship.friend || friendship; 
                  const isSelected = selectedFriends.includes(friend._id);

                  return (
                    <div 
                      key={friend._id}
                      onClick={() => toggleFriend(friend._id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-violet-500 bg-violet-50" 
                          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <img 
                        src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}`} 
                        alt="" 
                        className="w-10 h-10 rounded-full border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{friend.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{friend.email}</p>
                      </div>
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-violet-600 text-white" : "border-2 border-slate-300"
                      }`}>
                        {isSelected && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={createTripMutation.isPending || !formData.title || !formData.destination}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 sm:py-5 rounded-2xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 mt-4 shrink-0"
          >
            {createTripMutation.isPending ? "Creating Trip..." : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;