
import { useBalances } from "../../hooks/useBalances";

const BalanceCard = ({
  tripId,
}) => {
  const {
    data: balances = [],
  } = useBalances(tripId);

  return (
    <div
      className="
      bg-white
      p-6
      rounded-3xl
    "
    >
      <h2 className="text-xl font-bold mb-5">
        Balances
      </h2>

      {balances.map(
        (balance) => (
          <div
            key={balance.userId}
            className="
            flex
            justify-between
            py-2
          "
          >
            <span>
              {balance.name}
            </span>

            <span
              className={
                balance.netBalance >
                0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              ₹
              {balance.netBalance}
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default BalanceCard;