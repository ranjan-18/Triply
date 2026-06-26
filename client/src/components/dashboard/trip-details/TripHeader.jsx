import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";

const TripHeader = ({ trip, onAddExpense }) => {
  if (!trip) return null;

  return (
    <div
      className="
      relative
      rounded-[36px]
      overflow-hidden
      h-[320px]
      shadow-sm
      mb-8
    "
    >
      {/* Background Image */}
      <img
        src={
          trip.coverImage ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        }
        alt={trip.title}
        className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
      "
      />

      {/* Overlay */}
      <div
        className="
        absolute
        inset-0
        bg-gradient-to-r
        from-black/70
        via-black/40
        to-black/30
      "
      />

      {/* Content */}
      <div
        className="
        relative
        z-10
        h-full
        flex
        items-end
        justify-between
        px-10
        py-10
      "
      >
        {/* Left */}
        <div>
          <h1
            className="
            text-5xl
            font-bold
            text-white
          "
          >
            {trip.title}
          </h1>

          <div className="flex items-center gap-2 mt-3">
            <FaMapMarkerAlt className="text-white/80" />

            <p className="text-xl text-white/90">
              {trip.destination}
            </p>
          </div>

          {/* Members */}
          <div className="flex items-center mt-8">
            <div className="flex -space-x-4">
              {trip.members?.map((member) => (
                <img
                  key={member.userId._id}
                  src={
                    member.userId.avatar ||
                    `https://ui-avatars.com/api/?name=${member.userId.name}&background=7C3AED&color=fff`
                  }
                  alt={member.userId.name}
                  className="
                  w-14
                  h-14
                  rounded-full
                  border-4
                  border-white
                  object-cover
                "
                />
              ))}
            </div>

            {trip?.members?.length || 0} Members
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={onAddExpense}
          className="
          flex
          items-center
          gap-3
          bg-white
          text-violet-600
          px-8
          py-4
          rounded-2xl
          font-semibold
          text-lg
          shadow-xl
          hover:scale-105
          transition
        "
        >
          <FaPlus />
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default TripHeader;