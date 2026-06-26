// src/pages/dashboard/SettingsPage.jsx

import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaUserEdit, FaSave } from "react-icons/fa";
import useAuthStore from "../../store/authStore";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";

const SettingsPage = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your personal profile</p>
          </div>
          <div className="w-16 h-16 bg-slate-200 rounded-3xl flex items-center justify-center text-slate-600 text-3xl">
            <FaUserEdit />
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
          
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-md" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-violet-700 text-4xl font-bold shadow-inner">
                {formData.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:border-violet-500 transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Avatar URL (Optional)</label>
              <input 
                type="url" 
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                placeholder="https://example.com/avatar.jpg"
                className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:border-violet-500 transition"
              />
            </div>
            
            <div className="pt-6">
              <button 
                type="submit"
                disabled={updateProfileMutation.isPending || (formData.name === user?.name && formData.avatar === user?.avatar)}
                className="bg-violet-600 text-white font-semibold rounded-2xl px-8 py-4 hover:bg-violet-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <FaSave /> {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
