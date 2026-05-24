import React, { useEffect, useState, useRef } from 'react';
import { Cpu, Server, Activity, ArrowUpRight } from 'lucide-react';
import { AccentColor } from '../types';
import { DECRYPTING_LOGS_PRESETS } from '../utils';
import { audioEngine } from './AudioEngine';

interface TerminalDecryptorScreenProps {
  accent: AccentColor;
  onDecryptionComplete: () => void;
}

export default function TerminalDecryptorScreen({
  accent,
  onDecryptionComplete,
}: TerminalDecryptorScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const colors = {
    red: { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', bar: 'bg-rose-500', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
    cyan: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', bar: 'bg-cyan-400', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
    green: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]' },
    purple: { text: 'text-fuchsia-400', border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-10/10', bar: 'bg-fuchsia-500', shadow: 'shadow-[0_0_15px_rgba(232,121,249,0.3)]' },
    amber: { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', bar: 'bg-amber-500', shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
  };

  const activeColor = colors[accent] || colors.red;

  // 1. Progress increment loop (accelerating/varying speed)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const step = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Play grand success chime!
          audioEngine.playDecryptionSuccess();
          setTimeout(() => {
            onDecryptionComplete();
          }, 600);
          return 100;
        }

        // Variable increments to feel natural and organic
        const increment = Math.floor(Math.random() * 8) + 3;
        const next = Math.min(prev + increment, 100);

        // Play feedback tick
        audioEngine.playClick();
        return next;
      });
    };

    // Fast-paced tick loop
    timer = setInterval(step, 130);
    return () => clearInterval(timer);
  }, [onDecryptionComplete]);

  // 2. Logging messages generator loop
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < DECRYPTING_LOGS_PRESETS.length) {
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} :: [SECURE_CORE] : ${DECRYPTING_LOGS_PRESETS[index]}`]);
        index++;
        // Audio tick on log entry
        audioEngine.playTypeKeyPress();
      } else {
        // Feed in random repetitive lines to keep terminal lively if progress drags on
        const randomPres = DECRYPTING_LOGS_PRESETS[Math.floor(Math.random() * DECRYPTING_LOGS_PRESETS.length)];
        setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} :: [SECURE_CORE] : ${randomPres}`]);
        audioEngine.playTypeKeyPress();
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // 3. Auto-scroll terminal log to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div id="decryptor-screen-wrapper" className="flex items-center justify-center p-4 min-h-[580px] w-full max-w-xl mx-auto font-mono">
      
      <div className={`w-full bg-[#0f172a] border border-slate-800 ${activeColor.shadow} rounded p-6 text-left relative overflow-hidden backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-neutral-900/10 scanlines pointer-events-none opacity-40"></div>

        {/* Decoder title */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className={`animate-spin ${activeColor.text}`} size={16} />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              QUANTUM RE-ASSEMBLER // COGNITIVE DECOMPRESSOR
            </span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-bold">
            VORTEX DEV_PORT: 3000
          </div>
        </div>

        {/* Large progress readout */}
        <div className="mb-5 flex flex-col sm:flex-row items-baseline justify-between">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">
            DECRYPTING EMOTION RECEPTACLE COGNITION:
          </div>
          <div className={`text-4xl md:text-5xl font-black font-mono tracking-tight leading-none ${activeColor.text}`} style={{ textShadow: `0 0 15px currentColor` }}>
            {progress}%
          </div>
        </div>

        {/* Grid Loading Meter bar block */}
        <div className="w-full bg-[#0b1120] p-1 border border-slate-800/80 rounded mb-6">
          <div className="grid grid-cols-20 gap-0.5 h-6">
            {Array.from({ length: 20 }).map((_, idx) => {
              const activeRatio = (idx + 1) / 20 * 100;
              const isActive = progress >= activeRatio;
              return (
                <div
                  key={idx}
                  className={`h-full transition-all duration-150 ${
                    isActive ? activeColor.bar : 'bg-[#0f172a]/25 border border-slate-800/40'
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 10px ${activeColor.bar.split('-')[1]}` : 'none'
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Lively diagnostic grids */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0b1120] p-2.5 border border-slate-800/80 rounded flex flex-col">
            <div className="text-[8.5px] text-slate-500 uppercase tracking-widest mb-1 font-bold">MEM_ALLOCATOR</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
              <Server size={11} className={activeColor.text} />
              <span>STABLE</span>
            </div>
          </div>
          <div className="bg-[#0b1120] p-2.5 border border-slate-800/80 rounded flex flex-col">
            <div className="text-[8.5px] text-slate-500 uppercase tracking-widest mb-1 font-bold">ACTIVE_SINE</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
              <Activity size={11} className={activeColor.text} />
              <span>{(60 + progress * 0.4).toFixed(0)} Hz</span>
            </div>
          </div>
          <div className="bg-[#0b1120] p-2.5 border border-slate-800/80 rounded flex flex-col">
            <div className="text-[8.5px] text-slate-500 uppercase tracking-widest mb-1 font-bold">FIDELITY_RNG</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
              <ArrowUpRight size={11} className={activeColor.text} />
              <span>99.998%</span>
            </div>
          </div>
        </div>

        {/* Hacking console scroll list */}
        <div className="text-xs text-slate-400 font-bold tracking-wider mb-2 select-none uppercase">
          Synapse decryption reports history:
        </div>
        <div
          ref={logContainerRef}
          className="h-44 bg-[#0b1120] border border-slate-800/80 p-3 rounded font-mono text-[10px] space-y-1.5 overflow-y-auto"
          style={{boxShadow: 'inset 0 0 10px rgba(0,0,0,0.45)'}}
        >
          {logs.map((log, i) => (
            <div key={i} className="text-slate-400 truncate leading-relaxed">
              <span className={`mr-2 md:inline hidden ${activeColor.text}`}>▶</span>
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-slate-600 animate-pulse uppercase font-bold">Waiting for socket feedback stream...</div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-[7.5px] text-slate-500 font-mono uppercase tracking-widest select-none font-bold">
          <span>DECOMPRESS_THREAD: COMPOSITIONAL_MATRICES</span>
          <span>© DEEP COGNITIVE CRACKER v4.0</span>
        </div>

      </div>
    </div>
  );
}
