// server/utils/calculateBalances.js

/**
 * Calculate net balances
 * Positive => should receive money
 * Negative => owes money
 */
export const calculateBalances = (
  expenses
) => {
  const balances = {};

  expenses.forEach(
    (expense) => {
      const payer =
        expense.paidBy.toString();

      balances[payer] =
        (balances[payer] || 0) +
        expense.amount;

      expense.splits.forEach(
        (split) => {
          const member =
            split.userId.toString();

          balances[member] =
            (balances[member] ||
              0) -
            split.owedAmount;
        }
      );
    }
  );

  return balances;
};