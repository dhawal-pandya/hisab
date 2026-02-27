export const calculateSettlement = (users) => {
  const balances = {};
  let totalExpense = 0;

  // Calculate net balance for each user
  users.forEach(user => {
    balances[user.name] = 0;
    user.expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      if (!isNaN(amount)) {
        balances[user.name] += amount;
        totalExpense += amount;
      }
    });
  });

  const numUsers = users.length;
  if (numUsers === 0) {
    return { transactions: [], totalExpense: 0, userBalances: [] };
  }

  const averageExpensePerUser = totalExpense / numUsers;

  users.forEach(user => {
    balances[user.name] -= averageExpensePerUser;
  });

  const debtors = []; // Users who owe money (negative balance)
  const creditors = []; // Users who are owed money (positive balance)

  for (const name in balances) {
    if (balances[name] < 0) {
      debtors.push({ name, amount: -balances[name] }); // Store as positive for easier calculation
    } else if (balances[name] > 0) {
      creditors.push({ name, amount: balances[name] });
    }
  }

  const transactions = [];

  // Greedy settlement algorithm
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: settledAmount,
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount === 0) {
      i++;
    }
    if (creditor.amount === 0) {
      j++;
    }
  }

  const userBalances = Object.keys(balances).map(name => ({
    name,
    balance: balances[name]
  }));

  return { transactions, totalExpense, userBalances };
};
