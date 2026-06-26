import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
} from "react-icons/fa";

const TripStats = ({
  totalSpent = 0,
  owe = 0,
  getBack = 0,
  members = 0,
}) => {
  const stats = [
    {
      title: "Total Spent",
      value: `₹${totalSpent}`,
      icon: <FaWallet />,
      bg: "bg-violet-100",
      color: "text-violet-600",
    },
    {
      title: "You Owe",
      value: `₹${owe}`,
      icon: <FaArrowUp />,
      bg: "bg-red-100",
      color: "text-red-500",
    },
    {
      title: "You Get Back",
      value: `₹${getBack}`,
      icon: <FaArrowDown />,
      bg: "bg-green-100",
      color: "text-green-500",
    },
    {
      title: "Members",
      value: members,
      icon: <FaUsers />,
      bg: "bg-blue-100",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
        "
        >
          <div
            className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            text-xl
            mb-5
            ${stat.bg}
            ${stat.color}
          `}
          >
            {stat.icon}
          </div>

          <p className="text-slate-500">
            {stat.title}
          </p>

          <h2
            className="
            text-3xl
            font-bold
            mt-2
          "
          >
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default TripStats;