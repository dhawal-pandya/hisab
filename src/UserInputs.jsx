import React, { useState } from 'react';

const UserInputs = ({ onCalculate, initialUsers }) => {
  const [users, setUsers] = useState(() =>
    initialUsers || [{ id: 1, name: '', expenses: [{ id: 1, description: '', amount: '' }] }]
  );
  const [nextUserId, setNextUserId] = useState(() => {
    if (!initialUsers?.length) return 2;
    return Math.max(...initialUsers.map(u => u.id)) + 1;
  });
  const [nextExpenseId, setNextExpenseId] = useState(() => {
    if (!initialUsers) return 2;
    const ids = initialUsers.flatMap(u => u.expenses.map(e => e.id));
    return ids.length > 0 ? Math.max(...ids) + 1 : 2;
  });

  const handleAddUser = () => {
    setUsers([...users, { id: nextUserId, name: '', expenses: [{ id: nextExpenseId, description: '', amount: '' }] }]);
    setNextUserId(nextUserId + 1);
    setNextExpenseId(nextExpenseId + 1);
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUserNameChange = (userId, name) => {
    setUsers(users.map(user => user.id === userId ? { ...user, name } : user));
  };

  const handleAddExpense = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, expenses: [...user.expenses, { id: nextExpenseId, description: '', amount: '' }] }
        : user
    ));
    setNextExpenseId(nextExpenseId + 1);
  };

  const handleRemoveExpense = (userId, expenseId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, expenses: user.expenses.filter(e => e.id !== expenseId) }
        : user
    ));
  };

  const handleExpenseChange = (userId, expenseId, field, value) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, expenses: user.expenses.map(e => e.id === expenseId ? { ...e, [field]: value } : e) }
        : user
    ));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-zinc-100 mb-6">Who Paid What?</h2>

      {users.map(user => (
        <div key={user.id} className="mb-5 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={user.name}
              onChange={(e) => handleUserNameChange(user.id, e.target.value)}
              className="flex-grow p-3 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
            {users.length > 1 && (
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="sm:w-auto px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-medium text-sm transition-all duration-200"
              >
                Remove
              </button>
            )}
          </div>

          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Expenses {user.name ? `· ${user.name}` : ''}
          </p>

          {user.expenses.map(expense => (
            <div key={expense.id} className="flex flex-col sm:flex-row items-center mb-2 gap-2">
              <input
                type="text"
                placeholder="Description"
                value={expense.description}
                onChange={(e) => handleExpenseChange(user.id, expense.id, 'description', e.target.value)}
                className="w-full sm:flex-grow p-2.5 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 text-sm transition-all"
              />
              <div className="flex w-full sm:w-auto gap-2">
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={expense.amount}
                  onChange={(e) => handleExpenseChange(user.id, expense.id, 'amount', e.target.value)}
                  className="flex-grow sm:w-32 p-2.5 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 text-sm transition-all"
                />
                <button
                  onClick={() => handleRemoveExpense(user.id, expense.id)}
                  className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all duration-200 flex-shrink-0 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => handleAddExpense(user.id)}
            className="mt-3 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 font-medium text-sm transition-all duration-200"
          >
            + Add Expense
          </button>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
        <button
          onClick={handleAddUser}
          className="sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium transition-all duration-200"
        >
          + Add Person
        </button>
        <button
          onClick={() => onCalculate(users)}
          className="sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          Calculate →
        </button>
      </div>
    </div>
  );
};

export default UserInputs;
