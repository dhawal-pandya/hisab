export const calculateSettlement = (users) => {
  if (users.length === 0) {
    return { transactions: [], totalExpense: 0, userBalances: [] };
  }

  const paid = {};
  const owed = {};
  const userIdToName = {};

  users.forEach(user => {
    paid[user.name] = 0;
    owed[user.name] = 0;
    userIdToName[user.id] = user.name;
  });

  let totalExpense = 0;

  users.forEach(user => {
    user.expenses.forEach(expense => {
      const amount = parseFloat(expense.amount);
      if (isNaN(amount) || amount <= 0) return;

      paid[user.name] += amount;
      totalExpense += amount;

      const participants = expense.participants && expense.participants.length > 0
        ? expense.participants
        : users.map(u => u.id);

      const sharePerParticipant = amount / participants.length;
      participants.forEach(participantId => {
        const name = userIdToName[participantId];
        if (name !== undefined) {
          owed[name] += sharePerParticipant;
        }
      });
    });
  });

  const balances = {};
  users.forEach(user => {
    balances[user.name] = paid[user.name] - owed[user.name];
  });

  const EPSILON = 0.001;
  const debtors = [];
  const creditors = [];

  for (const name in balances) {
    if (balances[name] < -EPSILON) {
      debtors.push({ name, amount: -balances[name] });
    } else if (balances[name] > EPSILON) {
      creditors.push({ name, amount: balances[name] });
    }
  }

  const transactions = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settledAmount = Math.min(debtor.amount, creditor.amount);
    transactions.push({ from: debtor.name, to: creditor.name, amount: settledAmount });
    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;
    if (debtor.amount < EPSILON) i++;
    if (creditor.amount < EPSILON) j++;
  }

  const userBalances = users.map(user => ({
    name: user.name,
    balance: balances[user.name],
  }));

  return { transactions, totalExpense, userBalances };
};
