import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Volume2, VolumeX, Settings, Sparkles, X, Palette, HeartHandshake, FileCode, Check, Download, ExternalLink, Lock, Key, Loader2 } from 'lucide-react';
import { audioEngine } from './components/AudioEngine';
import { getSinglePageHtml } from './singlePageHtml';

interface FloatingMessage {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  color: string;
  angle: number;
  targetX?: number;
  targetY?: number;
}

export default function App() {
  const [screen, setScreen] = useState<'login' | 'loading' | 'main'>('login');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing romantic link...');

  const [customMessage, setCustomMessage] = useState('i love you');
  const [accent, setAccent] = useState<'pink' | 'purple' | 'cyan' | 'amber' | 'emerald'>('pink');
  const [bpm, setBpm] = useState(72);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingMessage[]>([]);
  const [interactionCount, setInteractionCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; color: string }[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Synchronize audio synthesizer toggle
  useEffect(() => {
    audioEngine.toggle(soundEnabled);
  }, [soundEnabled]);

  // Rhythmic heartbeat beat sound loop - only runs on the main screen!
  useEffect(() => {
    if (screen !== 'main') return;
    const pulseTrigger = setInterval(() => {
      // Play sub-synth synchronized with the pulse
      audioEngine.playHeartbeat(1.1);
    }, (60 / bpm) * 1000);

    return () => clearInterval(pulseTrigger);
  }, [bpm, soundEnabled, screen]);

  // Loading phase progress bar effect
  useEffect(() => {
    if (screen === 'loading') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        if (progress < 25) {
          setLoadingText('Initializing romantic link...');
        } else if (progress < 45) {
          setLoadingText('Connecting heartbeat frequencies...');
        } else if (progress < 65) {
          setLoadingText('Generating custom color theme...');
        } else if (progress < 85) {
          setLoadingText('Synthesizing high fidelity love...');
        } else {
          setLoadingText('Opening your custom gift room...');
        }
        setLoadingPhase(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScreen('main');
            // Play success chime
            audioEngine.playDecryptionSuccess();
          }, 400);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [screen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playClick();
    if (passwordInput.trim().toLowerCase() === 'orphelia') {
      setScreen('loading');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2200);
    }
  };

  // Accent styles config matching soft, romantic pastel gradients
  const themes = {
    pink: {
      bg: 'from-rose-950 via-neutral-950 to-[#1c0a15]',
      glow: 'rgba(244, 63, 94, 0.45)',
      hex: '#f43f5e',
      text: 'text-rose-400',
      pill: 'bg-rose-500/10 border-rose-500/40 text-rose-300',
      pillActive: 'bg-rose-500 border-rose-400 text-white',
      btn: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20',
      bar: 'accent-rose-500',
    },
    purple: {
      bg: 'from-violet-950 via-neutral-950 to-[#140a24]',
      glow: 'rgba(168, 85, 247, 0.45)',
      hex: '#a855f7',
      text: 'text-purple-400',
      pill: 'bg-purple-500/10 border-purple-500/40 text-purple-300',
      pillActive: 'bg-purple-500 border-purple-400 text-white',
      btn: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20',
      bar: 'accent-purple-500',
    },
    cyan: {
      bg: 'from-cyan-950 via-neutral-950 to-[#0a1c24]',
      glow: 'rgba(6, 182, 212, 0.45)',
      hex: '#06b6d4',
      text: 'text-cyan-400',
      pill: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
      pillActive: 'bg-cyan-500 border-cyan-400 text-white',
      btn: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/20',
      bar: 'accent-cyan-500',
    },
    amber: {
      bg: 'from-amber-950 via-neutral-950 to-[#1f1003]',
      glow: 'rgba(245, 158, 11, 0.45)',
      hex: '#f59e0b',
      text: 'text-amber-400',
      pill: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
      pillActive: 'bg-amber-500 border-amber-400 text-white',
      btn: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      bar: 'accent-amber-500',
    },
    emerald: {
      bg: 'from-emerald-950 via-neutral-950 to-[#051a13]',
      glow: 'rgba(16, 185, 129, 0.45)',
      hex: '#10b981',
      text: 'text-emerald-400',
      pill: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
      pillActive: 'bg-emerald-500 border-emerald-400 text-white',
      btn: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20',
      bar: 'accent-emerald-500',
    },
  };

  const activeTheme = themes[accent] || themes.pink;

  // Render a lovely floating love capsule on the screen and ripple feedback
  const triggerLoveSparkle = (e?: React.MouseEvent) => {
    // Prevent accidental triggers when clicking on buttons, inputs, links, or settings menus
    if (e && ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('#drawer-child') || (e.target as HTMLElement).closest('a'))) {
      return;
    }

    const touchX = e ? e.clientX : window.innerWidth / 2;
    const touchY = e ? e.clientY : window.innerHeight / 2 - 40;

    audioEngine.playClick();
    setInteractionCount((prev) => prev + 1);

    const compliments = [
      customMessage,
      '❤️', '✨', 'always you', 'my favorite', 'beautiful', 'forever', 'smiling inside', '😘', '💕'
    ];
    const pickedText = compliments[Math.floor(Math.random() * compliments.length)];

    const newF: FloatingMessage = {
      id: Math.random().toString(),
      text: pickedText,
      x: touchX,
      y: touchY,
      scale: 0.85 + Math.random() * 0.4,
      color: activeTheme.hex,
      angle: (Math.random() - 0.5) * 45,
    };

    setFloatingHearts((prev) => [...prev, newF].slice(-15));

    // Create expanding ripple effect coordinate
    const newRipple = {
      id: Math.random().toString(),
      x: touchX,
      y: touchY,
      color: activeTheme.hex,
    };
    setRipples((prev) => [...prev, newRipple].slice(-10));
  };

  // Clean stale floating messages periodically
  useEffect(() => {
    if (floatingHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingHearts((prev) => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [floatingHearts]);

  // Clean stale ripples periodically for performance
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Handle continuous hold to explode mechanism
  useEffect(() => {
    if (!isHolding) {
      setHoldProgress(0);
      return;
    }

    const duration = 5000; // 5 seconds
    const intervalMs = 50; 
    const step = (intervalMs / duration) * 100;

    const timer = setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          triggerExplosion();
          setIsHolding(false);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isHolding]);

  const handleHoldStart = () => {
    setIsHolding(true);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
  };

  const triggerExplosion = () => {
    audioEngine.playSweep();
    setTimeout(() => {
      audioEngine.playDecryptionSuccess();
    }, 150);

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const centerX = winW / 2;
    const centerY = winH / 2 - 40;

    const explosionWords = [
      customMessage,
      '❤️', '💖', '💝', '💘', '💕', '💞', '💍', '✨', 'always you', 'my favorite', 'beautiful', 'forever', 'smiling inside', '😘', '💕', 'Melted!', 'Love Blast!', 'My Heart!', 'Sweetheart!', 'Orphelia', 'Denzel ❤️'
    ];

    const newHearts: FloatingMessage[] = [];

    // Create 25 explosive particles radiating from the center of the giant heart
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * 360 + (Math.random() - 0.5) * 20;
      const distance = 140 + Math.random() * 200;
      const angleRad = (angle * Math.PI) / 180;

      const startX = centerX + (Math.random() - 0.5) * 30;
      const startY = centerY + (Math.random() - 0.5) * 30;

      const targetX = startX - 12 + Math.cos(angleRad) * distance;
      const targetY = startY - 12 + Math.sin(angleRad) * distance;

      const pickedText = explosionWords[Math.floor(Math.random() * explosionWords.length)];

      newHearts.push({
        id: `ep-${Math.random()}-${i}`,
        text: pickedText,
        x: startX,
        y: startY,
        scale: 0.8 + Math.random() * 0.8,
        color: activeTheme.hex,
        angle: (Math.random() - 0.5) * 60,
        targetX,
        targetY,
      });
    }

    setFloatingHearts((prev) => [...prev, ...newHearts].slice(-40));
    setInteractionCount((prev) => prev + 25);

    // Blast out multiple circular ripples for physical shockwave effect
    setRipples((prev) => [
      ...prev,
      {
        id: `megarip-1-${Math.random()}`,
        x: centerX,
        y: centerY,
        color: activeTheme.hex,
      },
      {
        id: `megarip-2-${Math.random()}`,
        x: centerX - 30,
        y: centerY,
        color: activeTheme.hex,
      },
      {
        id: `megarip-3-${Math.random()}`,
        x: centerX + 30,
        y: centerY,
        color: activeTheme.hex,
      }
    ].slice(-25));
  };

  // Handle single page code copiers
  const copyRawHtml = () => {
    const fullHtml = getSinglePageHtml(customMessage, accent, bpm);
    navigator.clipboard.writeText(fullHtml);
    setCopied(true);
    audioEngine.playDecryptionSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle direct downloader
  const downloadHtmlFile = () => {
    const fullHtml = getSinglePageHtml(customMessage, accent, bpm);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gift_for_you.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    audioEngine.playDecryptionSuccess();
  };

  // Framer Motion pulse frequency config
  const beatIntervalMs = (60 / bpm) * 1000;
  const heartbeatAnimation = {
    scale: [1, 1.05, 0.99, 1.04, 1],
    opacity: [0.93, 1, 0.95, 1, 0.93],
    transition: {
      duration: beatIntervalMs / 1000,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${activeTheme.bg} text-neutral-200 font-sans relative overflow-x-hidden flex flex-col justify-between p-4 selection:bg-rose-500/20`}>
      
      {/* Decorative scanline overlay for subtle warmth */}
      <div className="absolute inset-0 bg-neutral-950/10 scanlines pointer-events-none z-10"></div>

      <AnimatePresence mode="wait">
        {screen === 'login' && (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center items-center px-4 self-center z-20"
          >
            <motion.div 
              animate={loginError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="w-full bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden text-center"
            >
              {/* Absolutes decorative blobs */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl"></div>

              <div className="flex flex-col items-center">
                {/* Padlock / Heart dynamic icon */}
                <div className="w-16 h-16 rounded-full bg-slate-950/50 border border-slate-800 flex items-center justify-center relative mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Heart className="text-rose-400 absolute w-5 h-5 -mt-3.5 -mr-3.5" fill="#f43f5e" />
                  </motion.div>
                  <Lock className="text-slate-300 w-6 h-6" />
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2 font-display">
                  Secret Surprise Box
                </h1>
                <p className="text-xs text-slate-400 leading-normal mb-8 max-w-xs">
                  A high-fidelity romantic experience has been crafted for you. Please enter the passcode to uncover the key.
                </p>

                <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        audioEngine.playTypeKeyPress();
                      }}
                      placeholder="Enter secret word..."
                      className="w-full bg-slate-950/80 border border-slate-800/80 px-4 py-3.5 pr-10 text-center text-sm font-mono tracking-widest text-white rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all placeholder:font-sans placeholder:tracking-normal placeholder:opacity-40"
                    />
                    <Key className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  </div>

                  <AnimatePresence>
                    {loginError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-rose-400 font-mono font-bold"
                      >
                        Passcode incorrect. (Hint: her name)
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-rose-500/25"
                  >
                    <span>Unlock Surprise</span>
                  </button>
                </form>

                <div className="mt-8 text-[9px] font-mono uppercase text-slate-500 tracking-wider">
                  love protocol v1.0 // restricted access
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === 'loading' && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-center items-center px-4 self-center z-20 text-center"
          >
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              {/* Rotating glowing halo rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-t-rose-500 border-r-transparent border-b-violet-500 border-l-transparent opacity-60"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-10 h-10 text-rose-500" fill="#f43f5e" />
              </motion.div>
            </div>

            <h2 className="text-lg font-bold text-white tracking-wide uppercase mb-2 font-display">
              Decrypting Heartspace
            </h2>
            
            {/* Realtime progress bar */}
            <div className="w-full h-1.5 bg-slate-900 border border-slate-800/50 rounded-full overflow-hidden mb-4 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 to-violet-500"
                style={{ width: `${loadingPhase}%` }}
              ></motion.div>
            </div>

            {/* Dynamic romantic phase texts */}
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-mono text-slate-400 uppercase tracking-widest min-h-[16px]"
              >
                {loadingText}
              </motion.p>
            </AnimatePresence>

            <span className="text-[10px] text-slate-500 font-mono mt-2">{loadingPhase}% COMPLETE</span>
          </motion.div>
        )}

        {screen === 'main' && (
          <motion.div
            key="main-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-grow w-full flex flex-col justify-between"
          >
            {/* Header controls layout simplified beautifully */}
            <header className="w-full flex justify-between items-center max-w-xl mx-auto z-20 pt-2 select-none">
              <div className="flex items-center gap-2">
                <HeartHandshake className={`${activeTheme.text} animate-pulse`} size={20} />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
                  Love Messenger
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound Synthesizer toggler */}
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    audioEngine.playClick();
                  }}
                  className="p-2 border border-slate-800/80 bg-slate-900/80 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer shadow-lg"
                  title={soundEnabled ? 'Mute' : 'Play sounds'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                {/* Configuration deck toggler */}
                <button
                  onClick={() => {
                    setShowSettings(true);
                    audioEngine.playClick();
                  }}
                  className="p-2 border border-slate-800/80 bg-slate-900/80 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer shadow-lg"
                >
                  <Settings size={16} />
                </button>
              </div>
            </header>

            {/* Interactive Main Presentational Stage */}
            <main
              onClick={triggerLoveSparkle}
              className="flex-1 w-full max-w-xl mx-auto flex flex-col items-center justify-center relative z-20 py-4 min-h-[380px]"
            >
              
              {/* Helper romantic title header with gorgeous fade-in entry */}
              <div className="text-center mb-8 select-none">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2"
                >
                  {customMessage === 'i love you' ? 'A Special Gift For You' : customMessage}
                </motion.h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1 min-h-[16px]">
                  {isHolding ? (
                    <span className="text-rose-400 animate-pulse text-[11px] font-mono tracking-normal">
                      CHARGING LOVE BLAST... {Math.round(holdProgress)}%
                    </span>
                  ) : (
                    <>
                      <span>Tap anywhere, or HOLD heart for 5s</span>
                      <Sparkles size={11} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    </>
                  )}
                </p>
              </div>

              {/* Central Beating Glow Heart Centerpiece */}
              <div
                onMouseDown={() => handleHoldStart()}
                onMouseUp={() => handleHoldEnd()}
                onMouseLeave={() => handleHoldEnd()}
                onTouchStart={() => handleHoldStart()}
                onTouchEnd={() => handleHoldEnd()}
                onContextMenu={(e) => e.preventDefault()}
                className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center cursor-pointer select-none group active:scale-95 transition-transform duration-100"
              >
                {/* Beating external aura */}
                <motion.div
                  animate={heartbeatAnimation}
                  className="absolute rounded-full w-44 h-44 opacity-25 blur-3xl"
                  style={{
                    backgroundColor: activeTheme.hex,
                    boxShadow: `0 0 60px ${activeTheme.hex}`,
                  }}
                ></motion.div>

                {/* Hold to Explode progress circular ring wrapper */}
                {isHolding && (
                  <svg className="absolute w-48 h-48 sm:w-56 sm:h-56 -rotate-90 pointer-events-none z-20" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(15, 23, 42, 0.4)"
                      strokeWidth="2"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={activeTheme.hex}
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 - (263.89 * holdProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                )}

                {/* SVG Parametric heart drawing using precise curves */}
                <motion.div
                  animate={heartbeatAnimation}
                  className="relative z-10 flex items-center justify-center"
                >
                  <svg
                    className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-2xl filter transition-all duration-300 group-hover:scale-105"
                    viewBox="0 0 24 24"
                    fill={activeTheme.hex}
                    style={{
                      filter: `drop-shadow(0 0 25px ${activeTheme.glow})`,
                    }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>

                  {/* Injected central custom message text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                    <span className="text-white font-extrabold text-[12px] sm:text-[13px] tracking-wide uppercase truncate max-w-[130px] drop-shadow-md">
                      {customMessage}
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-200 mt-1 opacity-80 leading-none">
                      {bpm} BPM
                    </span>
                  </div>
                </motion.div>

                {/* Elegant hint of pulse scale waves radiating behind */}
                <span className="absolute w-36 h-36 rounded-full border border-white/10 animate-ping opacity-20 pointer-events-none"></span>
              </div>

              {/* Counter to make it charmingly gamified */}
              <div className="mt-4 text-center select-none text-xs font-mono text-slate-500 uppercase">
                <span>Total Hearts Sent:</span>{' '}
                <strong className={`${activeTheme.text} font-bold text-sm ml-1`}>{interactionCount}</strong>
              </div>



            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Drawer Settings Dialog Menu (Sleek, gorgeous design matching phone screen format) */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/70 backdrop-blur-md">
            
            {/* Modal clickout zone */}
            <div className="absolute inset-0" onClick={() => setShowSettings(false)}></div>

            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-t-2xl p-6 relative z-10 text-left font-sans shadow-2xl"
            >
              {/* Decorative top draghandle bar */}
              <div className="w-12 h-1 bg-slate-800 rounded mx-auto mb-5"></div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <Palette className={activeTheme.text} size={18} />
                  <span className="text-sm font-extrabold text-white tracking-wide uppercase">Customize Your Gift</span>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    audioEngine.playClick();
                  }}
                  className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Text string modifier inputs */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Heart Custom Text
                  </label>
                  <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => {
                      setCustomMessage(e.target.value.slice(0, 18));
                      audioEngine.playTypeKeyPress();
                    }}
                    placeholder="e.g. marry me / always yours"
                    className="w-full bg-[#0b1120] p-3 border border-slate-800 text-sm text-slate-100 rounded focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Theme choice color accent circles selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Color Profile (Accent Theme)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['pink', 'purple', 'cyan', 'amber', 'emerald'] as const).map((clr) => {
                      const opt = themes[clr];
                      const isActive = accent === clr;
                      return (
                        <button
                          key={clr}
                          onClick={() => {
                            setAccent(clr);
                            audioEngine.playClick();
                          }}
                          className={`text-[10px] py-2 border rounded font-mono font-bold uppercase transition-all duration-150 cursor-pointer text-center leading-none tracking-tight ${
                            isActive ? opt.pillActive : opt.pill
                          }`}
                        >
                          {clr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Speed of visual and acoustic heartbeat */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Heartbeat Intensity (BPM)
                    </label>
                    <span className="text-xs text-white font-bold bg-[#0b1120] px-2 py-0.5 border border-slate-800 rounded font-mono">
                      {bpm} BPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="115"
                    value={bpm}
                    onChange={(e) => {
                      setBpm(Number(e.target.value));
                      audioEngine.playClick();
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Synthesis toggle logic inside modal */}
                <div className="flex items-center justify-between py-3 border-t border-slate-800 mt-4 text-sm text-slate-300">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Heartbeat sound synth</span>
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      audioEngine.playClick();
                    }}
                    className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      soundEnabled 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {soundEnabled ? 'audible' : 'muted'}
                  </button>
                </div>
              </div>

              {/* Submit trigger button */}
              <button
                onClick={() => {
                  setShowSettings(false);
                  audioEngine.playDecryptionSuccess();
                }}
                className={`w-full mt-6 py-3.5 border rounded-xl text-center text-xs tracking-[0.2em] font-extrabold uppercase transition-all duration-300 cursor-pointer ${activeTheme.btn}`}
              >
                Apply Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ripple Feedback & Floating Animated elements overlay rain */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {ripples.map((rip) => (
            <motion.div
              key={rip.id}
              initial={{
                position: 'absolute',
                left: rip.x - 4,
                top: rip.y - 4,
                width: 8,
                height: 8,
                borderRadius: '9999px',
                border: `2px solid ${rip.color}`,
                backgroundColor: `${rip.color}15`,
                boxShadow: `0 0 12px ${rip.color}40`,
                scale: 0,
                opacity: 0.8,
              }}
              animate={{
                scale: 25,
                opacity: 0,
              }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
              className="pointer-events-none"
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 1,
                scale: 0.1,
                x: heart.x - 12,
                y: heart.y - 12,
                rotate: heart.angle,
              }}
              animate={{
                opacity: 0,
                scale: heart.scale,
                y: heart.targetY !== undefined ? heart.targetY : heart.y - 180 - Math.random() * 100,
                x: heart.targetX !== undefined ? heart.targetX : heart.x - 12 + (Math.random() - 0.5) * 80,
                rotate: heart.angle + (Math.random() - 0.5) * 60,
              }}
              transition={{
                duration: heart.targetY !== undefined ? 2.0 : 2.8,
                ease: 'easeOut',
              }}
              className="absolute font-mono pointer-events-none text-sm font-black whitespace-nowrap bg-slate-950/80 px-2 py-1 border border-slate-800 rounded-lg shadow-xl"
              style={{
                color: heart.color,
                textShadow: `0 0 10px ${heart.color}`,
              }}
            >
              {heart.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer romantic brand */}
      <footer className="w-full text-center py-2 z-20 select-none">
        <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">
          Made with love by Denzel
        </span>
      </footer>

    </div>
  );
}
