import React, { useState } from 'react';
import './index.css';
import UserInputs from './UserInputs';
import ComplexUserInputs from './ComplexUserInputs';
import Results from './Results';
import { calculateSettlement } from './utils/settlement';

function App() {
  const [mode, setMode] = useState('simple');
  const [settlementData, setSettlementData] = useState(null);
  const [savedUsers, setSavedUsers] = useState(null);

  const handleCalculate = (users) => {
    setSavedUsers(users);
    setSettlementData(calculateSettlement(users));
  };

  // startFresh=true clears saved data; false keeps it so the form re-populates
  const handleReset = (startFresh = false) => {
    setSettlementData(null);
    if (startFresh) setSavedUsers(null);
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setSettlementData(null);
    setSavedUsers(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-zinc-950 text-zinc-100">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-center bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
        Hisab
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 w-full max-w-2xl">
        {!settlementData ? (
          <div className="p-4 md:p-8">
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full p-1 text-sm">
                <button
                  onClick={() => handleModeSwitch('simple')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    mode === 'simple'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Simple
                </button>
                <button
                  onClick={() => handleModeSwitch('complex')}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${
                    mode === 'complex'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Complex
                </button>
              </div>
            </div>
            {mode === 'simple'
              ? <UserInputs onCalculate={handleCalculate} initialUsers={savedUsers} />
              : <ComplexUserInputs onCalculate={handleCalculate} initialUsers={savedUsers} />
            }
          </div>
        ) : (
          <Results
            settlementData={settlementData}
            users={savedUsers}
            mode={mode}
            onReset={handleReset}
          />
        )}
      </div>

      <footer className="mt-8 text-zinc-600 text-sm">
        Made with ❤️ by{' '}
        <a
          href="https://dhawal-pandya.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Dhawal
        </a>
      </footer>
    </div>
  );
}

export default App;
