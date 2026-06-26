import {
  FaUtensils,
  FaCar,
  FaBed,
  FaReceipt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import useAuthStore from "../../../store/authStore";

const categoryIcons = {
  Food: <FaUtensils />,
  Transport: <FaCar />,
  Stay: <FaBed />,
  Other: <FaReceipt />,
};

const categoryColors = {
  Food: "bg-violet-100 text-violet-600",
  Transport:
    "bg-emerald-100 text-emerald-600",
  Stay: "bg-blue-100 text-blue-600",
  Other: "bg-orange-100 text-orange-600",
};

const ExpenseCard = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuthStore();
  
  // The user.id from JWT might be a string, and expense.paidBy._id is an object ID
  const isCreator = expense.paidBy?._id?.toString() === user?.id?.toString() || 
                    expense.paidBy?.toString() === user?.id?.toString();

  return (
    <div
      className="
      bg-white
      rounded-3xl
      p-6
      shadow-sm
      hover:shadow-lg
      transition-all
      duration-300
      border
      border-slate-100
    "
    >
      <div className="flex justify-between items-start">
        {/* LEFT */}
        <div className="flex gap-5">
          {/* Category Icon */}
          <div
            className={`
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            text-2xl
            ${
              categoryColors[
                expense.category
              ] ||
              "bg-slate-100 text-slate-600"
            }
          `}
          >
            {categoryIcons[
              expense.category
            ] || <FaReceipt />}
          </div>

          {/* Details */}
          <div>
            <h3
              className="
              text-xl
              font-bold
              text-slate-900
            "
            >
              {expense.title}
            </h3>

            <p
              className="
              text-slate-500
              mt-1
            "
            >
              {expense.category}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img
                src={
                  expense.paidBy?.avatar ||
                  `https://ui-avatars.com/api/?name=${expense.paidBy?.name}`
                }
                alt=""
                className="
                w-10
                h-10
                rounded-full
              "
              />

              <div>
                <p className="text-sm text-slate-500">
                  Paid by
                </p>

                <p className="font-medium">
                  {expense.paidBy?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <h2
            className="
            text-3xl
            font-bold
            text-slate-900
          "
          >
            ₹{expense.amount}
          </h2>

          <p
            className="
            text-slate-400
            mt-2
          "
          >
            {new Date(
              expense.date
            ).toLocaleDateString()}
          </p>

          {/* Actions */}
          {isCreator && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  onEdit(expense)
                }
                className="
                w-10
                h-10
                rounded-xl
                bg-violet-100
                text-violet-600
                flex
                items-center
                justify-center
                hover:bg-violet-600
                hover:text-white
                transition
              "
              >
                <FaEdit />
              </button>

              <button
                onClick={() =>
                  onDelete(
                    expense._id
                  )
                }
                className="
                w-10
                h-10
                rounded-xl
                bg-red-100
                text-red-500
                flex
                items-center
                justify-center
                hover:bg-red-500
                hover:text-white
                transition
              "
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Summary */}
      <div
        className="
        mt-6
        pt-6
        border-t
        flex
        justify-between
        text-sm
        text-slate-500
      "
      >
        <div>
          Split Type:
          <span className="font-semibold ml-2 text-slate-700">
            {expense.splitType}
          </span>
        </div>

        <div>
          Participants:
          <span className="font-semibold ml-2 text-slate-700">
            {expense.splits?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;