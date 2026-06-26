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
        flex-col
        md:flex-row
        items-start
        md:items-end
        justify-end
        md:justify-between
        px-6
        md:px-10
        py-6
        md:py-10
        gap-4
        md:gap-0
      "
      >
        {/* Left */}
        <div className="w-full">
          <h1
            className="
            text-3xl
            md:text-5xl
            font-bold
            text-white
            truncate
          "
          >
            {trip.title}
          </h1>

          <div className="flex items-center gap-2 mt-2 md:mt-3">
            <FaMapMarkerAlt className="text-white/80" />

            <p className="text-lg md:text-xl text-white/90 truncate">
              {trip.destination}
            </p>
          </div>

          {/* Members */}
          <div className="flex items-center mt-4 md:mt-8">
            <div className="flex -space-x-3 md:-space-x-4">
              {trip.members?.slice(0, 5).map((member) => (
                <img
                  key={member.userId._id}
                  src={
                    member.userId.avatar ||
                    `https://ui-avatars.com/api/?name=${member.userId.name}&background=7C3AED&color=fff`
                  }
                  alt={member.userId.name}
                  className="
                  w-10
                  h-10
                  md:w-14
                  md:h-14
                  rounded-full
                  border-2
                  md:border-4
                  border-white
                  object-cover
                "
                />
              ))}
            </div>
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={onAddExpense}
          className="
          flex
          items-center
          justify-center
          gap-2
          md:gap-3
          bg-white
          text-violet-600
          px-6
          py-3
          md:px-8
          md:py-4
          rounded-xl
          md:rounded-2xl
          font-semibold
          text-base
          md:text-lg
          shadow-xl
          hover:scale-105
          transition
          w-full
          md:w-auto
          shrink-0
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