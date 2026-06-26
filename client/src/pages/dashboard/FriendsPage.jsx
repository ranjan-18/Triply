// src/pages/dashboard/FriendsPage.jsx

import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaSearch, FaUserPlus, FaCheck, FaUserFriends, FaClock, FaUserTimes } from "react-icons/fa";
import { useSearchUsers, useGetFriends, useSendFriendRequest, useAcceptFriendRequest, useRemoveFriend } from "../../hooks/useFriends";
import useAuthStore from "../../store/authStore";
import ConfirmModal from "../../components/ui/ConfirmModal";

const FriendsPage = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(searchQuery);
  const { data: friendsData, isLoading: isFriendsLoading } = useGetFriends();
  
  const sendRequestMutation = useSendFriendRequest();
  const acceptRequestMutation = useAcceptFriendRequest();
  const removeFriendMutation = useRemoveFriend();

  const [friendToRemove, setFriendToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const handleSendRequest = (recipientId) => {
    sendRequestMutation.mutate(recipientId);
  };

  const handleAcceptRequest = (requestId) => {
    acceptRequestMutation.mutate(requestId);
  };

  const handleRemoveClick = (friend) => {
    setFriendToRemove(friend);
    setIsRemoveModalOpen(true);
  };

  const confirmRemoveFriend = () => {
    if (friendToRemove) {
      removeFriendMutation.mutate(friendToRemove._id, {
        onSettled: () => {
          setIsRemoveModalOpen(false);
          setFriendToRemove(null);
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Friends</h1>
            <p className="text-slate-500 mt-2 text-lg">Connect with people to easily split trips</p>
          </div>
          <div className="w-16 h-16 bg-violet-100 rounded-3xl flex items-center justify-center text-violet-600 text-3xl">
            <FaUserFriends />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SEARCH COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl text-slate-800 mb-4">Find Friends</h3>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="mt-6 space-y-4">
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <p className="text-sm text-slate-500 text-center py-4">Type at least 2 characters...</p>
                )}
                
                {isSearching && (
                  <p className="text-sm text-slate-500 text-center py-4 animate-pulse">Searching...</p>
                )}

                {searchResults?.length === 0 && searchQuery.length >= 2 && !isSearching && (
                  <p className="text-sm text-slate-500 text-center py-4">No new users found.</p>
                )}

                {searchResults?.map(resultUser => (
                  <div key={resultUser._id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center font-bold text-violet-700">
                        {resultUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{resultUser.name}</p>
                        <p className="text-xs text-slate-500 truncate w-24">{resultUser.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSendRequest(resultUser._id)}
                      disabled={sendRequestMutation.isPending}
                      className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition shadow-md disabled:opacity-50"
                    >
                      <FaUserPlus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LISTS COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PENDING RECEIVED */}
            {friendsData?.pendingReceived?.length > 0 && (
              <div>
                <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                  <FaClock className="text-orange-500" /> Pending Requests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friendsData.pendingReceived.map(req => (
                    <div key={req._id} className="bg-white p-4 rounded-3xl border border-orange-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center font-bold text-orange-700 text-xl">
                          {req.requester.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{req.requester.name}</p>
                          <p className="text-xs text-slate-500">wants to be friends</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAcceptRequest(req._id)}
                        disabled={acceptRequestMutation.isPending}
                        className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-200 transition text-sm flex items-center gap-2"
                      >
                        <FaCheck /> Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PENDING SENT */}
            {friendsData?.pendingSent?.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-4">Sent Requests</h3>
                <div className="flex flex-wrap gap-4">
                  {friendsData.pendingSent.map(req => (
                    <div key={req._id} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm flex items-center gap-3">
                      <span className="text-slate-600">Sent to <b>{req.recipient.name}</b></span>
                      <span className="text-xs bg-slate-200 px-2 py-1 rounded-md text-slate-500">Pending</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APPROVED FRIENDS */}
            <div>
              <h3 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                <FaUserFriends className="text-violet-500" /> My Friends ({friendsData?.friends?.length || 0})
              </h3>
              
              {isFriendsLoading ? (
                <div className="h-32 bg-white rounded-3xl border animate-pulse"></div>
              ) : friendsData?.friends?.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl mb-4">
                    <FaUserFriends />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No friends yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mt-2">Use the search bar on the left to find your friends and start collaborating on trips!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friendsData.friends.map(friend => (
                    <div key={friend._id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-violet-300 transition cursor-pointer">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center font-bold text-violet-700 text-xl shadow-inner">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{friend.name}</p>
                        <p className="text-sm text-slate-500">{friend.email}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveClick(friend)}
                        disabled={removeFriendMutation.isPending}
                        title="Remove Friend"
                        className="ml-auto w-10 h-10 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition disabled:opacity-50"
                      >
                        <FaUserTimes size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      <ConfirmModal 
        isOpen={isRemoveModalOpen}
        title="Remove Friend"
        message={friendToRemove ? `Are you sure you want to remove ${friendToRemove.name} from your friends list? You will no longer be able to easily split trips with them.` : ""}
        confirmText="Remove"
        cancelText="Keep Friend"
        isDestructive={true}
        isLoading={removeFriendMutation.isPending}
        onConfirm={confirmRemoveFriend}
        onCancel={() => {
          setIsRemoveModalOpen(false);
          setFriendToRemove(null);
        }}
      />
    </DashboardLayout>
  );
};

export default FriendsPage;
