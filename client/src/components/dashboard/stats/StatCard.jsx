const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  trendColor,
  iconBg,
}) => {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      p-6
      shadow-sm
      hover:shadow-md
      transition
      flex
      items-start
      justify-between
    "
    >
      <div
        className={`
          w-16
          h-16
          rounded-2xl
          flex
          items-center
          justify-center
          text-2xl
          ${iconBg}
        `}
      >
        {icon}
      </div>

      <div className="flex-1 ml-5">
        <p className="text-slate-500 text-sm">
          {title}
        </p>

        <h3
          className="
          text-4xl
          font-bold
          text-slate-900
          mt-1
        "
        >
          {value}
        </h3>

        <p
          className="
          text-slate-500
          text-sm
          mt-1
        "
        >
          {subtitle}
        </p>

        <div
          className={`
            mt-4
            inline-flex
            items-center
            px-3
            py-1
            rounded-full
            text-xs
            font-medium
            ${trendColor}
          `}
        >
          {trend}
        </div>
      </div>
    </div>
  );
};

export default StatCard;