import React, { useState } from 'react';
import { ShieldAlert, Cpu, Heart, Unlock, Volume2, VolumeX } from 'lucide-react';
import { AccentColor } from '../types';
import { audioEngine } from './AudioEngine';

interface TerminalLockScreenProps {
  onStartDecryption: (config: {
    message: string;
    accent: AccentColor;
    bpm: number;
  }) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function TerminalLockScreen({
  onStartDecryption,
  soundEnabled,
  onToggleSound,
}: TerminalLockScreenProps) {
  const [customWord, setCustomWord] = useState('i love you');
  const [accent, setAccent] = useState<AccentColor>('red');
  const [bpm, setBpm] = useState(72);

  const colors = {
    red: {
      btn: 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:border-rose-500',
      pill: 'border-slate-800 text-slate-400 bg-slate-900/40',
      pillActive: 'border-rose-500 bg-rose-500/10 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.1)]',
      border: 'border-slate-800',
    },
    cyan: {
      btn: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:border-cyan-500',
      pill: 'border-slate-800 text-slate-400 bg-slate-900/40',
      pillActive: 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)]',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.1)]',
      border: 'border-slate-800',
    },
    green: {
      btn: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:border-emerald-500',
      pill: 'border-slate-800 text-slate-400 bg-slate-900/40',
      pillActive: 'border-emerald-500 bg-emerald-500/10 text-white shadow-[0_0_12px_rgba(52,211,153,0.3)]',
      glow: 'shadow-[0_0_20px_rgba(52,211,153,0.1)]',
      border: 'border-slate-800',
    },
    purple: {
      btn: 'bg-fuchsia-950/40 border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-900/40 hover:shadow-[0_0_20px_rgba(232,121,249,0.3)] hover:border-fuchsia-500',
      pill: 'border-slate-800 text-slate-400 bg-slate-900/40',
      pillActive: 'border-fuchsia-500 bg-fuchsia-500/10 text-white shadow-[0_0_12px_rgba(232,121,249,0.3)]',
      glow: 'shadow-[0_0_20px_rgba(232,121,249,0.1)]',
      border: 'border-slate-800',
    },
    amber: {
      btn: 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:border-amber-500',
      pill: 'border-slate-800 text-slate-400 bg-slate-900/40',
      pillActive: 'border-amber-500 bg-amber-500/10 text-white shadow-[0_0_12px_rgba(251,191,36,0.3)]',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.1)]',
      border: 'border-slate-800',
    },
  };

  const activeColors = colors[accent] || colors.red;

  const handleStart = () => {
    onStartDecryption({
      message: customWord.trim() || 'i love you',
      accent,
      bpm,
    });
  };

  const selectColor = (col: AccentColor) => {
    setAccent(col);
    audioEngine.playClick();
  };

  return (
    <div id="lockscreen-wrapper" className="flex items-center justify-center p-4 min-h-[580px] w-full max-w-lg mx-auto select-none">
      
      <div className={`w-full bg-[#0f172a] border rounded border-slate-800 ${activeColors.glow} p-6 relative overflow-hidden backdrop-blur-sm transition-all duration-300`}>
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-neutral-900/5 scanlines pointer-events-none opacity-40"></div>

        {/* Diagnostic alert header mimicking window header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="p-2.5 bg-red-950/40 border border-red-500/20 text-red-500 rounded shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div className="font-mono text-left">
            <div className="text-xs text-red-400 font-bold tracking-widest uppercase">RESTRICTED SECTOR COREGROUP</div>
            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-tight">VORTEX ENGINE // PORT 3000 SECURITY BOUNDS</div>
          </div>
          
          <button
            onClick={onToggleSound}
            className="ml-auto p-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-white rounded cursor-pointer transition-all"
            title={soundEnabled ? "Mute audio synths" : "Enable audio synths"}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>

        {/* Core Warning Text in High Density design style */}
        <div className="bg-[#0b1120] p-3.5 border border-slate-800/80 font-mono text-[10px] text-slate-400 rounded mb-5 text-left leading-relaxed">
          <div className="text-slate-300 font-bold mb-1 uppercase tracking-wider">➔ INTEL AUDIT LOGS:</div>
          <div>• ACCESS ROOT ROUTE // LOCALHOST:3000 // COMPLETED</div>
          <div>• ENCRYPTED FILE REPERTOIRE: <span className="text-blue-400">core_heart.tsx</span></div>
          <div>• ACTIVE THREAD STATE REGISTRY: <span className="text-rose-400">ORGANIC_EMOTION</span></div>
        </div>

        {/* Configuration core options */}
        <div className="space-y-4 mb-6 font-mono text-left">
          
          {/* Custom words injection prompt */}
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Heart Message [String Modifier]
            </label>
            <input
              type="text"
              value={customWord}
              onChange={(e) => {
                setCustomWord(e.target.value.slice(0, 32));
                audioEngine.playTypeKeyPress();
              }}
              placeholder="e.g. i love you / marry me"
              className="w-full bg-[#0b1120] p-2.5 border border-slate-800 font-bold focus:border-slate-700 text-xs text-white rounded font-mono placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          {/* Accent beams override */}
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Resonance Color Accent (theme)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['red', 'cyan', 'green', 'purple', 'amber'] as AccentColor[]).map((clr) => {
                const isActive = accent === clr;
                return (
                  <button
                    key={clr}
                    onClick={() => selectColor(clr)}
                    className={`border text-[10px] py-1.5 rounded cursor-pointer uppercase text-center font-mono font-bold leading-none tracking-tight transition-all duration-200 ${
                      isActive ? colors[clr].pillActive : colors[clr].pill
                    }`}
                  >
                    {clr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biometrics frequency BPM range slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Target Biometric Wave Frequency
              </label>
              <span className="text-[10px] text-slate-300 font-bold bg-[#0b1120] px-2 py-0.5 border border-slate-800 rounded">
                {bpm} BPM
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              value={bpm}
              onChange={(e) => {
                setBpm(Number(e.target.value));
                audioEngine.playClick();
              }}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

        </div>

        {/* Large trigger launch deck */}
        <button
          onClick={handleStart}
          className={`w-full py-3.5 border rounded text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer relative z-20 ${activeColors.btn}`}
          style={{ textShadow: '0 0 6px currentColor' }}
        >
          <Cpu size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>DECRYPT HEART CORE</span>
          <Unlock size={14} />
        </button>

        {/* Soft bottom credit indicator (minimalist) - aligning precisely with outline list looks */}
        <div className="mt-4 flex justify-between items-center text-[8.5px] text-slate-500 font-mono tracking-widest uppercase">
          <span>COGNITIVE CORE INTEL v4.1</span>
          <div className="flex gap-1.5">
            <Heart size={8} className="fill-current text-red-500 animate-pulse" />
            <span>ENCRYPTED VITALITY</span>
          </div>
        </div>

      </div>
    </div>
  );
}
