import { useState, useRef, useEffect, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaUserEdit, FaSave, FaCamera, FaTimes, FaCrop, FaPen } from "react-icons/fa";
import useAuthStore from "../../store/authStore";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";

const SettingsPage = () => {
  const { user } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  // Crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Update state if user prop changes
  useEffect(() => {
    setName(user?.name || "");
    setPreviewUrl(user?.avatar || "");
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageToCrop(url);
      setCropModalOpen(true);
      
      // Reset input so selecting the same file again works
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels, 0);
      const croppedFile = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
      
      setAvatarFile(croppedFile);
      setPreviewUrl(URL.createObjectURL(croppedFile));
      setCropModalOpen(false);
    } catch (e) {
      console.error(e);
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
                {/* Pencil Badge */}
                <div className="absolute bottom-1 right-1 w-9 h-9 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                  <FaPen size={14} />
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

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] overflow-hidden w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <FaCrop className="text-violet-600" /> Adjust Avatar
              </h3>
              <button 
                onClick={() => setCropModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="relative w-full h-80 bg-slate-900">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-6 bg-white space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full accent-violet-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setCropModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCropImage}
                  className="flex-1 py-3 px-4 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 shadow-md transition"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default SettingsPage;
