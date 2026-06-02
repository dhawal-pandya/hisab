import React, { useState } from 'react';
import './index.css';
import UserInputs from './UserInputs';
import ComplexUserInputs from './ComplexUserInputs';
import Results from './Results';
import { calculateSettlement } from './utils/settlement';

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('hisab_mode') || 'simple');
  const [settlementData, setSettlementData] = useState(null);
  const [savedUsers, setSavedUsers] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleCalculate = (users) => {
    setSavedUsers(users);
    setSettlementData(calculateSettlement(users));
  };

  const handleReset = (startFresh = false) => {
    setSettlementData(null);
    if (startFresh) setSavedUsers(null);
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    localStorage.setItem('hisab_mode', newMode);
    setSettlementData(null);
    setSavedUsers(null);
  };

  const handleClear = () => {
    localStorage.removeItem('hisab_simple');
    localStorage.removeItem('hisab_complex');
    setSavedUsers(null);
    setSettlementData(null);
    setResetKey(k => k + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-zinc-950 text-zinc-100">
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
          हिसाब
        </h1>
        <p className="text-sm md:text-base text-zinc-500 mt-1 tracking-widest uppercase">
          Hisab
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 w-full max-w-2xl">
        {!settlementData ? (
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-sm font-medium transition-all duration-200"
              >
                Clear
              </button>
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
              ? <UserInputs key={`simple-${resetKey}`} onCalculate={handleCalculate} initialUsers={savedUsers} />
              : <ComplexUserInputs key={`complex-${resetKey}`} onCalculate={handleCalculate} initialUsers={savedUsers} />
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
