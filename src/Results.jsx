import React, { useState } from 'react';

const Results = ({ settlementData, users, mode, onReset }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { transactions, totalExpense, userBalances } = settlementData;

  if (!settlementData || userBalances.length === 0) return null;

  const buildBreakdown = () => {
    if (!users) return null;

    if (mode === 'simple') {
      const fairShare = totalExpense / users.length;
      return {
        type: 'simple',
        fairShare,
        rows: users.map(u => ({
          name: u.name,
          paid: u.expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0),
          share: fairShare,
        })),
      };
    }

    // Complex mode
    const userIdToName = {};
    users.forEach(u => { userIdToName[u.id] = u.name; });

    const lines = [];
    users.forEach(user => {
      user.expenses.forEach(exp => {
        const amount = parseFloat(exp.amount);
        if (!amount || amount <= 0) return;
        const ids = exp.participants?.length > 0 ? exp.participants : users.map(u => u.id);
        const names = ids.map(id => userIdToName[id]).filter(Boolean);
        lines.push({
          payer: user.name,
          description: exp.description || null,
          amount,
          participants: names,
          shareEach: amount / names.length,
        });
      });
    });

    const shareMap = {};
    const paidMap = {};
    users.forEach(u => { shareMap[u.name] = 0; paidMap[u.name] = 0; });
    lines.forEach(line => {
      line.participants.forEach(name => { shareMap[name] = (shareMap[name] || 0) + line.shareEach; });
    });
    users.forEach(u => {
      paidMap[u.name] = u.expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    });

    return { type: 'complex', lines, shareMap, paidMap };
  };

  const breakdown = buildBreakdown();

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl font-bold text-zinc-100 mb-6">Settlement</h2>

      {/* Total */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
        <span className="text-zinc-400 text-sm font-medium">Total Expenses</span>
        <span className="text-emerald-400 text-2xl font-bold">₹{totalExpense.toFixed(2)}</span>
      </div>

      {/* Net Balances */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Net Balances</p>
        <div className="space-y-2">
          {userBalances.map((user, index) => (
            <div key={index} className="flex justify-between items-center bg-zinc-800/50 border border-zinc-700/50 p-3 rounded-xl">
              <span className="text-zinc-200 font-medium">{user.name}</span>
              {user.balance < -0.005 ? (
                <span className="text-rose-400 font-semibold">owes ₹{(-user.balance).toFixed(2)}</span>
              ) : user.balance > 0.005 ? (
                <span className="text-emerald-400 font-semibold">gets ₹{user.balance.toFixed(2)}</span>
              ) : (
                <span className="text-zinc-600">settled</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Transactions */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Minimum Transactions</p>
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((t, index) => (
              <div key={index} className="bg-zinc-800/50 border border-zinc-700/50 p-3 rounded-xl flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-rose-400">{t.from}</span>
                <span className="text-zinc-500 text-sm">→</span>
                <span className="font-semibold text-emerald-400">{t.to}</span>
                <span className="ml-auto text-zinc-100 font-bold">₹{t.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm">Everyone is settled — no transfers needed.</p>
        )}
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="mb-6">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition-all duration-200 text-sm"
          >
            <span className="font-medium">How was this calculated?</span>
            <span className="text-xs">{showBreakdown ? '▲ hide' : '▼ show'}</span>
          </button>

          {showBreakdown && (
            <div className="mt-2 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30 text-sm space-y-4">
              {breakdown.type === 'simple' ? (
                <>
                  <p className="text-zinc-400">
                    ₹{totalExpense.toFixed(2)} ÷ {users.length} people
                    {' = '}
                    <span className="text-zinc-200 font-semibold">₹{breakdown.fairShare.toFixed(2)} each</span>
                  </p>
                  <div className="space-y-1.5 border-t border-zinc-700 pt-3">
                    {breakdown.rows.map((row, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-zinc-300 font-medium">{row.name}</span>
                        <span className="text-zinc-500">
                          paid <span className="text-zinc-300">₹{row.paid.toFixed(2)}</span>
                          {' · '}
                          share <span className="text-zinc-300">₹{row.share.toFixed(2)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {breakdown.lines.length === 0 ? (
                    <p className="text-zinc-500">No expenses entered.</p>
                  ) : (
                    <div className="space-y-3">
                      {breakdown.lines.map((line, i) => (
                        <div key={i} className="pl-3 border-l-2 border-zinc-600">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-violet-400 font-medium">{line.payer}</span>
                            <span className="text-zinc-400">paid</span>
                            <span className="text-zinc-200 font-semibold">₹{line.amount.toFixed(2)}</span>
                            {line.description && (
                              <span className="text-zinc-500">· {line.description}</span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-xs mt-0.5">
                            split among {line.participants.join(', ')}
                            {' → '}
                            <span className="text-zinc-300">₹{line.shareEach.toFixed(2)} each</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-700 space-y-1.5">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Per-person summary</p>
                    {Object.entries(breakdown.shareMap).map(([name, share]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="text-zinc-300 font-medium">{name}</span>
                        <span className="text-zinc-500">
                          paid <span className="text-zinc-300">₹{(breakdown.paidMap[name] || 0).toFixed(2)}</span>
                          {' · '}
                          owes <span className="text-zinc-300">₹{share.toFixed(2)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-zinc-800">
        <button
          onClick={() => onReset(false)}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium transition-all duration-200 text-sm"
        >
          ← Edit Expenses
        </button>
        <button
          onClick={() => onReset(true)}
          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/20 text-sm"
        >
          Start Fresh
        </button>
      </div>
    </div>
  );
};

export default Results;
