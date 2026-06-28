import { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaUserEdit, FaSave, FaCamera } from "react-icons/fa";
import useAuthStore from "../../store/authStore";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";

const SettingsPage = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  // Update state if user prop changes
  useEffect(() => {
    setName(user?.name || "");
    setPreviewUrl(user?.avatar || "");
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    updateProfileMutation.mutate(formData);
  };

  const isUnchanged = name === user?.name && !avatarFile;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your personal profile</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-3xl flex items-center justify-center text-violet-600 text-3xl shadow-sm">
            <FaUserEdit />
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-violet-600 to-purple-600 w-full relative"></div>

          <div className="px-8 pb-10">
            {/* Avatar Section */}
            <div className="relative -mt-16 mb-8 flex justify-center lg:justify-start">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white bg-white" 
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-violet-700 text-5xl font-bold shadow-lg border-4 border-white bg-white">
                    {name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-4 border-transparent">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 ring-violet-50 transition font-medium text-slate-800"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <button 
                  type="submit"
                  disabled={updateProfileMutation.isPending || isUnchanged}
                  className="bg-violet-600 text-white font-semibold rounded-2xl px-8 py-4 hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <FaSave /> {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
                {isUnchanged && (
                  <span className="text-sm text-slate-500 font-medium">Up to date</span>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
