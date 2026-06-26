// server/utils/calculateBalances.js

/**
 * Calculate net balances per user from a list of expenses.
 *
 * For each expense:
 *   - The person who paid receives credit (+amount)
 *   - Each person in the split owes their share (-owedAmount)
 *
 * Positive netBalance  => this user is owed money (gets back)
 * Negative netBalance  => this user owes money
 *
 * NOTE: expenses must be populated via .populate("paidBy") and
 * .populate("splits.userId") so paidBy and split.userId are objects.
 *
 * @param {Array} expenses - Array of populated expense documents
 * @returns {Object} Map of userId string => net balance number
 */
export const calculateBalances = (expenses) => {
  const balances = {};

  expenses.forEach((expense) => {
    // paidBy is a populated object after .populate(); use _id
    const payer =
      expense.paidBy?._id?.toString() ?? expense.paidBy?.toString();

    if (payer) {
      balances[payer] = (balances[payer] || 0) + expense.amount;
    }

    expense.splits.forEach((split) => {
      // split.userId is also a populated object; use _id
      const member =
        split.userId?._id?.toString() ?? split.userId?.toString();

      if (member) {
        balances[member] = (balances[member] || 0) - split.owedAmount;
      }
    });
  });

  return balances;
};