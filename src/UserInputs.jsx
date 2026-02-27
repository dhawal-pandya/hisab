import React, { useState } from 'react';

const UserInputs = ({ onCalculate }) => {
  const [users, setUsers] = useState([{ id: 1, name: '', expenses: [{ id: 1, description: '', amount: '' }] }]);
  const [nextUserId, setNextUserId] = useState(2);
  const [nextExpenseId, setNextExpenseId] = useState(2);

  const handleAddUser = () => {
    setUsers([...users, { id: nextUserId, name: '', expenses: [{ id: 1, description: '', amount: '' }] }]);
    setNextUserId(nextUserId + 1);
    setNextExpenseId(2); // Reset expense ID for new user
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUserNameChange = (userId, name) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, name } : user
    ));
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
        ? { ...user, expenses: user.expenses.filter(expense => expense.id !== expenseId) }
        : user
    ));
  };

  const handleExpenseChange = (userId, expenseId, field, value) => {
    setUsers(users.map(user =>
      user.id === userId
        ? {
            ...user,
            expenses: user.expenses.map(expense =>
              expense.id === expenseId ? { ...expense, [field]: value } : expense
            )
          }
        : user
    ));
  };

  const calculateExpenses = () => {
    onCalculate(users);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl mb-8">
      <h2 className="text-2xl font-bold text-teal-400 mb-6">Who Paid What?</h2>
      {users.map(user => (
        <div key={user.id} className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-700">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="User Name"
              value={user.name}
              onChange={(e) => handleUserNameChange(user.id, e.target.value)}
              className="flex-grow p-3 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {users.length > 1 && (
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200"
              >
                Remove User
              </button>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-200 mb-3">Expenses for {user.name || 'this user'}</h3>
          {user.expenses.map(expense => (
            <div key={expense.id} className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Description"
                value={expense.description}
                onChange={(e) => handleExpenseChange(user.id, expense.id, 'description', e.target.value)}
                className="flex-grow p-3 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) => handleExpenseChange(user.id, expense.id, 'amount', e.target.value)}
                className="w-32 p-3 rounded-md bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
              />
              <button
                onClick={() => handleRemoveExpense(user.id, expense.id)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddExpense(user.id)}
            className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition duration-200"
          >
            Add Expense
          </button>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          onClick={handleAddUser}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-md transition duration-200 text-lg"
        >
          Add Another User
        </button>
        <button
          onClick={calculateExpenses}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition duration-200 text-lg"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default UserInputs;
