import React, { useState } from 'react';
import './index.css';
import UserInputs from './UserInputs';
import Results from './Results';
import { calculateSettlement } from './utils/settlement';

function App() {
  const [settlementData, setSettlementData] = useState(null);

  const handleCalculate = (users) => {
    const data = calculateSettlement(users);
    setSettlementData(data);
  };

  const handleReset = () => {
    setSettlementData(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 md:px-0 bg-gray-900 text-gray-100">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-green-500 tracking-tight leading-tight text-center">
        Hisab
      </h1>
      <div className="bg-gray-800 p-4 md:p-8 rounded-lg shadow-xl w-full max-w-2xl">
        {!settlementData ? (
          <UserInputs onCalculate={handleCalculate} />
        ) : (
          <Results settlementData={settlementData} onReset={handleReset} />
        )}
      </div>

      <footer className="mt-8 text-gray-400">
        Made with ❤️ by <a href="https://dhawal-pandya.github.io" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Dhawal</a>
      </footer>
    </div>
  );
}

export default App;
