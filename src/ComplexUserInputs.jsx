import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'hisab_complex';

const DEFAULT_USERS = [
  { id: 1, name: '', expenses: [] },
  { id: 2, name: '', expenses: [] },
];

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ComplexUserInputs = ({ onCalculate, initialUsers }) => {
  const saved = !initialUsers ? loadSaved() : null;

  const [stage, setStage] = useState(() => {
    if (initialUsers) return initialUsers.some(u => u.expenses?.length > 0) ? 'expenses' : 'people';
    return saved?.stage || 'people';
  });

  const [users, setUsers] = useState(() => {
    if (initialUsers) return initialUsers;
    return saved?.users || DEFAULT_USERS;
  });

  const [nextUserId, setNextUserId] = useState(() => {
    const u = initialUsers || saved?.users || DEFAULT_USERS;
    return Math.max(...u.map(u => u.id), 2) + 1;
  });

  const [nextExpenseId, setNextExpenseId] = useState(() => {
    const u = initialUsers || saved?.users || DEFAULT_USERS;
    const ids = u.flatMap(u => (u.expenses || []).map(e => e.id));
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, stage }));
  }, [users, stage]);

  // ── Stage 1: People ─────────────────────────────────────────────────────────

  const handleAddPerson = () => {
    setUsers([...users, { id: nextUserId, name: '', expenses: [] }]);
    setNextUserId(nextUserId + 1);
  };

  const handleRemovePerson = (userId) => {
    setUsers(
      users
        .filter(u => u.id !== userId)
        .map(u => ({
          ...u,
          expenses: u.expenses.map(exp => ({
            ...exp,
            participants: exp.participants.filter(id => id !== userId),
          })),
        }))
    );
  };

  const handleNameChange = (userId, name) => {
    setUsers(users.map(u => u.id === userId ? { ...u, name } : u));
  };

  const canContinue = users.filter(u => u.name.trim()).length >= 2;

  const handleContinue = () => {
    const allIds = users.map(u => u.id);
    let expId = nextExpenseId;
    const initialized = users.map(u => ({
      ...u,
      expenses: u.expenses.length > 0
        ? u.expenses
        : [{ id: expId++, description: '', amount: '', participants: [...allIds] }],
    }));
    setUsers(initialized);
    setNextExpenseId(expId);
    setStage('expenses');
  };

  // ── Stage 2: Expenses ───────────────────────────────────────────────────────

  const handleAddExpense = (userId) => {
    const allIds = users.map(u => u.id);
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, expenses: [...u.expenses, { id: nextExpenseId, description: '', amount: '', participants: [...allIds] }] }
        : u
    ));
    setNextExpenseId(nextExpenseId + 1);
  };

  const handleRemoveExpense = (userId, expenseId) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, expenses: u.expenses.filter(e => e.id !== expenseId) }
        : u
    ));
  };

  const handleExpenseChange = (userId, expenseId, field, value) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, expenses: u.expenses.map(e => e.id === expenseId ? { ...e, [field]: value } : e) }
        : u
    ));
  };

  const handleParticipantToggle = (userId, expenseId, participantId) => {
    setUsers(users.map(u =>
      u.id === userId
        ? {
            ...u,
            expenses: u.expenses.map(exp => {
              if (exp.id !== expenseId) return exp;
              const isIn = exp.participants.includes(participantId);
              if (isIn && exp.participants.length === 1) return exp;
              return {
                ...exp,
                participants: isIn
                  ? exp.participants.filter(id => id !== participantId)
                  : [...exp.participants, participantId],
              };
            }),
          }
        : u
    ));
  };

  // ── Render: Stage 1 ─────────────────────────────────────────────────────────

  if (stage === 'people') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Who's in this group?</h2>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Step 1 of 2</span>
        </div>

        <div className="space-y-3 mb-6">
          {users.map((u, index) => (
            <div key={u.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Person ${index + 1}`}
                value={u.name}
                onChange={(e) => handleNameChange(u.id, e.target.value)}
                className="flex-grow p-3 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
              {users.length > 2 && (
                <button
                  onClick={() => handleRemovePerson(u.id)}
                  className="px-3 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all duration-200 flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={handleAddPerson}
            className="sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium transition-all duration-200"
          >
            + Add Person
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`sm:w-auto px-8 py-2.5 rounded-xl font-bold transition-all duration-200 ${
              canContinue
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed'
            }`}
          >
            Next: Add Expenses →
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Stage 2 ─────────────────────────────────────────────────────────

  const namedUsers = users.filter(u => u.name.trim());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setStage('people')}
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          ← Edit Group
        </button>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Step 2 of 2</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {namedUsers.map(u => (
          <span key={u.id} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
            {u.name}
          </span>
        ))}
      </div>

      {namedUsers.map(user => (
        <div key={user.id} className="mb-5 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
          <p className="text-sm font-semibold text-zinc-300 mb-4">{user.name}</p>

          {user.expenses.map(expense => (
            <div key={expense.id} className="mb-4">
              <div className="flex flex-col sm:flex-row items-center mb-2 gap-2">
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

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-1 text-sm">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wide">Split with</span>
                {namedUsers.map(u => {
                  const isChecked = expense.participants.includes(u.id);
                  const isLast = isChecked && expense.participants.length === 1;
                  return (
                    <label
                      key={u.id}
                      className={`flex items-center gap-1.5 text-sm ${isLast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isLast}
                        onChange={() => handleParticipantToggle(user.id, expense.id, u.id)}
                        className="accent-emerald-500 w-3.5 h-3.5"
                      />
                      <span className={isChecked ? 'text-zinc-200' : 'text-zinc-500'}>{u.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={() => handleAddExpense(user.id)}
            className="mt-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 font-medium text-sm transition-all duration-200"
          >
            + Add Expense
          </button>
        </div>
      ))}

      <div className="flex justify-end mt-6">
        <button
          onClick={() => onCalculate(namedUsers)}
          className="sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold transition-all duration-200 shadow-lg shadow-emerald-500/20"
        >
          Calculate →
        </button>
      </div>
    </div>
  );
};

export default ComplexUserInputs;
