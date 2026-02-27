import React from 'react';

const Results = ({ settlementData, onReset }) => {
  const { transactions, totalExpense, userBalances } = settlementData;

  if (!settlementData || userBalances.length === 0) {
    return null; // Don't render if no data
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-teal-400 mb-6">Settlement Results</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Net Balances</h3>
        <div className="space-y-2">
          {userBalances.map((user, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
              <span className="text-gray-100 font-medium">{user.name}</span>
              {user.balance < 0 ? (
                <span className="text-red-500 font-bold">Owes ₹{-user.balance.toFixed(2)}</span>
              ) : user.balance > 0 ? (
                <span className="text-green-500 font-bold">Gets ₹{user.balance.toFixed(2)}</span>
              ) : (
                <span className="text-gray-400">Settled</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Minimum Transactions</h3>
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((t, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-md text-gray-100">
                <span className="font-medium text-red-400">{t.from}</span> owes <span className="font-medium text-green-400">{t.to}</span> ₹<span className="font-bold text-lg">{t.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No transactions needed. Everyone is settled!</p>
        )}
      </div>
      <div className="mt-8 pt-4 border-t border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-teal-400">Total Expense:</h3>
        <span className="text-green-400 text-2xl font-bold">₹{totalExpense.toFixed(2)}</span>
      </div>
      <button
        onClick={onReset}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200 text-lg w-full"
      >
        Start New Calculation
      </button>
    </div>
  );
};

export default Results;