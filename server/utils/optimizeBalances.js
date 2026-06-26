// server/utils/optimizeBalances.js

/**
 * Min-Transaction Algorithm (Greedy approach)
 * 
 * Computes the minimum number of transactions required to settle all debts.
 * 
 * @param {Array} balances - Array of { userId, name, avatar, netBalance }
 * @returns {Array} Array of transactions { from: Object, to: Object, amount: Number }
 */
export const optimizeBalances = (balances) => {
  // Separate into debtors (negative balance) and creditors (positive balance)
  // Store them as objects { user: {userId, name, avatar}, amount: abs(netBalance) }
  const debtors = [];
  const creditors = [];

  for (const b of balances) {
    if (b.netBalance < -0.01) {
      debtors.push({
        user: { userId: b.userId, name: b.name, avatar: b.avatar },
        amount: Math.abs(b.netBalance),
      });
    } else if (b.netBalance > 0.01) {
      creditors.push({
        user: { userId: b.userId, name: b.name, avatar: b.avatar },
        amount: b.netBalance,
      });
    }
  }

  // Sort both arrays descending to make greedy matches (largest debtor pays largest creditor)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  let i = 0; // index for debtors
  let j = 0; // index for creditors

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // The settlement amount is the minimum of what debtor owes and what creditor is owed
    const minAmount = Math.min(debtor.amount, creditor.amount);
    
    // Create the transaction, rounded to 2 decimal places
    transactions.push({
      from: debtor.user,
      to: creditor.user,
      amount: Number(minAmount.toFixed(2)),
    });

    // Deduct the settled amount
    debtor.amount = Number((debtor.amount - minAmount).toFixed(2));
    creditor.amount = Number((creditor.amount - minAmount).toFixed(2));

    // If debtor is fully settled, move to next
    if (debtor.amount === 0) {
      i++;
    }

    // If creditor is fully settled, move to next
    if (creditor.amount === 0) {
      j++;
    }
  }

  return transactions;
};
