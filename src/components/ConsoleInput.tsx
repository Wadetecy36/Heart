import React, { useState, useRef, useEffect } from 'react';
import { audioEngine } from './AudioEngine';
import { AccentColor } from '../types';

interface ConsoleInputProps {
  onExecuteCommand: (cmdText: string) => void;
  accent: AccentColor;
  systemState: string;
}

export default function ConsoleInput({
  onExecuteCommand,
  accent,
  systemState,
}: ConsoleInputProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = {
    red: 'text-rose-400 focus-within:border-rose-500/50 caret-rose-400',
    cyan: 'text-cyan-400 focus-within:border-cyan-500/50 caret-cyan-400',
    green: 'text-emerald-400 focus-within:border-emerald-500/50 caret-emerald-400',
    purple: 'text-fuchsia-400 focus-within:border-fuchsia-500/50 caret-fuchsia-400',
    amber: 'text-amber-400 focus-within:border-amber-500/50 caret-amber-400',
  };

  const activeColorClass = colors[accent] || colors.red;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    // Trigger execution
    onExecuteCommand(trimmed);

    // Track command history
    setHistory((prev) => [trimmed, ...prev].slice(0, 30));
    setHistoryIndex(-1);
    setValue('');

    // Play confirm tone
    audioEngine.playSweep();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // Sound effect on keypress
    audioEngine.playTypeKeyPress();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setValue('');
      }
    }
  };

  // Keep input focused when clicking nearby
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Commands helper shortcuts to click for immediate execution
  const shortcuts = [
    { label: 'Shatter Heart', cmd: '/burst' },
    { label: 'Set BPM: 90', cmd: '/bpm 90' },
    { label: 'Love Mode', cmd: '/message forever & always' },
    { label: 'Help Menu', cmd: '/help' },
  ];

  return (
    <div id="console-terminal-cli" className="border border-slate-800 bg-[#0f172a] h-full flex flex-col justify-between font-mono rounded overflow-hidden">
      
      {/* IDE Terminal style tab header from High Density theme */}
      <div className="flex h-8 shrink-0 items-center px-4 gap-4 text-[11px] font-bold border-b border-slate-800 bg-slate-900/40 select-none">
        <span className="text-blue-400 border-b border-blue-400 h-full flex items-center tracking-wider uppercase">TERMINAL // CLI</span>
        <span className="text-slate-500 h-full flex items-center font-medium cursor-not-allowed">DEBUG CONSOLE</span>
        <span className="text-slate-500 h-full flex items-center font-medium cursor-not-allowed">PROBLEMS</span>
        <span className="ml-auto text-slate-500 text-[9px] uppercase">SYS_STATE: {systemState}</span>
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between bg-[#0b1120]/45">
        {/* Suggested quick-click pills with High Density slate elements */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-[10px] text-slate-500 py-0.5 select-none font-bold">SHORTCUTS:</span>
          {shortcuts.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onExecuteCommand(sc.cmd);
                audioEngine.playClick();
              }}
              className="text-[10px] bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* High Density terminal input format mimicking the design HTML */}
        <form onSubmit={handleSubmit} onClick={handleContainerClick} className={`relative flex items-center bg-[#0b1120]/80 p-2.5 border border-slate-800 rounded transition-all cursor-text focus-within:border-blue-500/40 ${activeColorClass}`}>
          <div className="flex items-center text-xs space-x-1 shrink-0 select-none mr-2">
            <span className="text-emerald-500">➜</span>
            <span className="text-blue-400 font-bold">heart-engine</span>
            <span className="text-slate-500 tracking-tight">git:(<span className="text-rose-500 font-semibold">main</span>)</span>
            <span className="text-slate-300 font-bold">~$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type command... Ex: '/help' or '/bpm 100'"
            className="bg-transparent text-xs w-full focus:outline-none caret-blue-400 text-slate-100 font-mono placeholder-slate-700"
            autoComplete="off"
            autoFocus
          />
          <div className="text-[9px] text-slate-500 shrink-0 select-none hidden md:block uppercase font-bold">
            [Enter] to execute
          </div>
        </form>
      </div>
    </div>
  );
}
