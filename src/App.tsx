import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Info,
  Cpu,
  Database,
  ArrowRight
} from 'lucide-react';
import { BankersState, SafetyResult } from './types';
import { calculateNeed, checkSafety } from './utils/bankers';

const INITIAL_PROCESSES = 5;
const INITIAL_RESOURCES = 3;

export default function App() {
  const [numProcesses, setNumProcesses] = useState(INITIAL_PROCESSES);
  const [numResources, setNumResources] = useState(INITIAL_RESOURCES);
  
  const [available, setAvailable] = useState<number[]>(new Array(INITIAL_RESOURCES).fill(0));
  const [max, setMax] = useState<number[][]>(
    Array.from({ length: INITIAL_PROCESSES }, () => new Array(INITIAL_RESOURCES).fill(0))
  );
  const [allocation, setAllocation] = useState<number[][]>(
    Array.from({ length: INITIAL_PROCESSES }, () => new Array(INITIAL_RESOURCES).fill(0))
  );

  const [result, setResult] = useState<SafetyResult | null>(null);

  // Initialize with some example data
  useEffect(() => {
    const exampleAvailable = [3, 3, 2];
    const exampleMax = [
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2],
      [4, 3, 3]
    ];
    const exampleAllocation = [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2]
    ];
    
    setAvailable(exampleAvailable);
    setMax(exampleMax);
    setAllocation(exampleAllocation);
  }, []);

  const need = useMemo(() => calculateNeed(max, allocation), [max, allocation]);

  const handleRunAlgorithm = () => {
    const state: BankersState = {
      numProcesses,
      numResources,
      available,
      max,
      allocation,
      need
    };
    const safetyResult = checkSafety(state);
    setResult(safetyResult);
  };

  const handleReset = () => {
    setResult(null);
  };

  const updateAvailable = (idx: number, val: string) => {
    const newAvailable = [...available];
    newAvailable[idx] = parseInt(val) || 0;
    setAvailable(newAvailable);
  };

  const updateMax = (pIdx: number, rIdx: number, val: string) => {
    const newMax = [...max];
    newMax[pIdx][rIdx] = parseInt(val) || 0;
    setMax(newMax);
  };

  const updateAllocation = (pIdx: number, rIdx: number, val: string) => {
    const newAllocation = [...allocation];
    newAllocation[pIdx][rIdx] = parseInt(val) || 0;
    setAllocation(newAllocation);
  };

  const addProcess = () => {
    setNumProcesses(prev => prev + 1);
    setMax(prev => [...prev, new Array(numResources).fill(0)]);
    setAllocation(prev => [...prev, new Array(numResources).fill(0)]);
  };

  const removeProcess = (idx: number) => {
    if (numProcesses <= 1) return;
    setNumProcesses(prev => prev - 1);
    setMax(prev => prev.filter((_, i) => i !== idx));
    setAllocation(prev => prev.filter((_, i) => i !== idx));
  };

  const addResource = () => {
    setNumResources(prev => prev + 1);
    setAvailable(prev => [...prev, 0]);
    setMax(prev => prev.map(row => [...row, 0]));
    setAllocation(prev => prev.map(row => [...row, 0]));
  };

  const removeResource = (idx: number) => {
    if (numResources <= 1) return;
    setNumResources(prev => prev - 1);
    setAvailable(prev => prev.filter((_, i) => i !== idx));
    setMax(prev => prev.map(row => row.filter((_, i) => i !== idx)));
    setAllocation(prev => prev.map(row => row.filter((_, i) => i !== idx)));
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 border-b border-[#141414] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif italic tracking-tight">Banker's Algorithm</h1>
          <p className="text-sm opacity-60 uppercase tracking-widest mt-1">Deadlock Detection & Avoidance Simulator</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRunAlgorithm}
            className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-6 py-2 hover:bg-opacity-90 transition-all cursor-pointer"
          >
            <Play size={16} />
            <span>Run Analysis</span>
          </button>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 border border-[#141414] px-6 py-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Section */}
        <section className="lg:col-span-2 space-y-8">
          {/* Resource Configuration */}
          <div className="bg-white p-6 border border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif italic text-xl flex items-center gap-2">
                <Database size={20} />
                Available Resources
              </h2>
              <button onClick={addResource} className="text-xs border border-[#141414] px-2 py-1 flex items-center gap-1 hover:bg-[#141414] hover:text-white transition-all">
                <Plus size={12} /> Add Resource
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {available.map((val, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase opacity-50 font-mono">R{idx}</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => updateAvailable(idx, e.target.value)}
                      className="w-16 border border-[#141414] p-2 font-mono text-center focus:outline-none focus:bg-[#141414] focus:text-white transition-all"
                    />
                    <button onClick={() => removeResource(idx)} className="ml-1 p-1 opacity-30 hover:opacity-100 text-red-600">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Matrices */}
          <div className="bg-white p-6 border border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif italic text-xl flex items-center gap-2">
                <Cpu size={20} />
                Process State Matrix
              </h2>
              <button onClick={addProcess} className="text-xs border border-[#141414] px-2 py-1 flex items-center gap-1 hover:bg-[#141414] hover:text-white transition-all">
                <Plus size={12} /> Add Process
              </button>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#141414]">
                  <th className="p-2 text-left font-serif italic text-sm opacity-50">Process</th>
                  <th className="p-2 text-center font-serif italic text-sm opacity-50" colSpan={numResources}>Allocation</th>
                  <th className="p-2 text-center font-serif italic text-sm opacity-50" colSpan={numResources}>Max Demand</th>
                  <th className="p-2 text-center font-serif italic text-sm opacity-50" colSpan={numResources}>Need (Remaining)</th>
                  <th className="p-2"></th>
                </tr>
                <tr className="border-b border-[#141414]">
                  <th></th>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <React.Fragment key={i}>
                      {Array.from({ length: numResources }).map((_, r) => (
                        <th key={r} className="p-1 text-[10px] font-mono opacity-40">R{r}</th>
                      ))}
                    </React.Fragment>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numProcesses }).map((_, pIdx) => (
                  <tr key={pIdx} className="border-b border-[#141414] hover:bg-[#F5F5F3] transition-colors">
                    <td className="p-2 font-mono font-bold">P{pIdx}</td>
                    
                    {/* Allocation */}
                    {allocation[pIdx].map((val, rIdx) => (
                      <td key={`alloc-${rIdx}`} className="p-1">
                        <input 
                          type="number" 
                          value={val} 
                          onChange={(e) => updateAllocation(pIdx, rIdx, e.target.value)}
                          className="w-10 border border-[#141414] p-1 text-center font-mono text-xs focus:outline-none focus:bg-[#141414] focus:text-white transition-all"
                        />
                      </td>
                    ))}

                    {/* Max */}
                    {max[pIdx].map((val, rIdx) => (
                      <td key={`max-${rIdx}`} className="p-1">
                        <input 
                          type="number" 
                          value={val} 
                          onChange={(e) => updateMax(pIdx, rIdx, e.target.value)}
                          className="w-10 border border-[#141414] p-1 text-center font-mono text-xs focus:outline-none focus:bg-[#141414] focus:text-white transition-all"
                        />
                      </td>
                    ))}

                    {/* Need */}
                    {need[pIdx].map((val, rIdx) => (
                      <td key={`need-${rIdx}`} className="p-1 text-center font-mono text-xs opacity-60">
                        {val}
                      </td>
                    ))}

                    <td className="p-2">
                      <button onClick={() => removeProcess(pIdx)} className="p-1 opacity-20 hover:opacity-100 text-red-600 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Results Section */}
        <aside className="space-y-8">
          <div className="bg-white p-6 border border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] h-full flex flex-col">
            <h2 className="font-serif italic text-xl mb-6 flex items-center gap-2">
              <Info size={20} />
              Analysis Result
            </h2>

            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#141414] opacity-40"
                >
                  <Play size={48} className="mb-4" />
                  <p className="text-sm">Configure the matrices and run the analysis to check for safe states.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className={`p-4 border-2 mb-6 flex items-center gap-4 ${result.isSafe ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-red-500 bg-red-50 text-red-900'}`}>
                    {result.isSafe ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                    <div>
                      <h3 className="font-bold uppercase tracking-wider">System is {result.isSafe ? 'Safe' : 'Unsafe'}</h3>
                      <p className="text-xs opacity-70">
                        {result.isSafe 
                          ? 'A safe sequence exists to execute all processes.' 
                          : 'Deadlock may occur. No safe sequence found.'}
                      </p>
                    </div>
                  </div>

                  {result.isSafe && (
                    <div className="mb-6">
                      <h4 className="text-[10px] uppercase font-mono opacity-50 mb-2">Safe Sequence</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {result.safeSequence.map((p, i) => (
                          <React.Fragment key={p}>
                            <div className="bg-[#141414] text-white px-3 py-1 font-mono text-sm">P{p}</div>
                            {i < result.safeSequence.length - 1 && <ArrowRight size={14} className="opacity-30" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto max-h-[400px] border-t border-[#141414] pt-4">
                    <h4 className="text-[10px] uppercase font-mono opacity-50 mb-4">Execution Steps</h4>
                    <div className="space-y-3">
                      {result.steps.map((step, i) => (
                        <div key={i} className="text-xs font-mono border-l-2 border-[#141414] pl-3 py-1">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#141414] opacity-40 flex justify-between items-center text-[10px] uppercase tracking-widest">
        <div>Banker's Algorithm Simulator v1.0</div>
        <div>Built for OS Resource Management Analysis</div>
      </footer>
    </div>
  );
}
