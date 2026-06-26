import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaShareAlt,
} from "react-icons/fa";

import toast from "react-hot-toast";

const TripCard = ({
  trip,
  onEdit,
  onDelete,
  onLeave,
}) => {
  const navigate = useNavigate();

  const inviteLink =
    `${window.location.origin}/join/${trip.inviteCode}`;

  const copyInviteLink = (e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(
      inviteLink
    );

    toast.success(
      "Invite link copied!"
    );
  };

  return (
    <div
      onClick={() =>
        navigate(`/trips/${trip._id}`)
      }
      className="
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-sm
        hover:shadow-lg
        transition
        cursor-pointer
      "
    >
      <img
        src={
          trip.coverImage ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        }
        alt={trip.title}
        className="
          w-full
          h-52
          object-cover
        "
      />

      <div className="p-5">
        <h3 className="text-xl font-bold">
          {trip.title}
        </h3>

        <p className="text-slate-500">
          {trip.destination}
        </p>

        <div className="mt-2">
          <span
            className="
              inline-block
              bg-slate-100
              text-slate-600
              text-sm
              px-3
              py-1
              rounded-full
            "
          >
            Code: {trip.inviteCode}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <FaUsers />

          <span>
            {trip.members?.length || 0} Members
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(trip);
            }}
            className="
              bg-violet-100
              text-violet-700
              py-2
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaEdit />
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip._id);
            }}
            className="
              bg-red-100
              text-red-600
              py-2
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaTrash />
            Delete
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLeave(trip._id);
            }}
            className="
              bg-orange-100
              text-orange-600
              py-2
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaSignOutAlt />
            Leave
          </button>

          <button
            onClick={copyInviteLink}
            className="
              bg-blue-100
              text-blue-600
              py-2
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <FaShareAlt />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;