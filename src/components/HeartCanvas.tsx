import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { HeartTextNode, AccentColor } from '../types';
import { audioEngine } from './AudioEngine';

interface HeartCanvasProps {
  nodes: HeartTextNode[];
  accent: AccentColor;
  bpm: number;
  triggerBurst: boolean;
  onClearBurst: () => void;
  customMessage: string;
}

export default function HeartCanvas({
  nodes,
  accent,
  bpm,
  triggerBurst,
  onClearBurst,
  customMessage,
}: HeartCanvasProps) {
  const [shattered, setShattered] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Map accent to CSS color classes & shadow properties
  const colorMap = {
    red: {
      text: 'text-rose-500',
      textGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.35)]',
      hex: '#f43f5e',
      glowRgba: 'rgba(244, 63, 94, 0.5)',
      badgeBg: 'bg-rose-950/40 text-rose-400 border-rose-500/30'
    },
    cyan: {
      text: 'text-cyan-400',
      textGlow: 'shadow-[0_0_15px_rgba(34,211,238,0.35)]',
      hex: '#22d3ee',
      glowRgba: 'rgba(34, 211, 238, 0.5)',
      badgeBg: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
    },
    green: {
      text: 'text-emerald-400',
      textGlow: 'shadow-[0_0_15px_rgba(52,211,153,0.35)]',
      hex: '#34d399',
      glowRgba: 'rgba(52, 211, 153, 0.5)',
      badgeBg: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
    },
    purple: {
      text: 'text-fuchsia-400',
      textGlow: 'shadow-[0_0_15px_rgba(232,121,249,0.35)]',
      hex: '#e879f9',
      glowRgba: 'rgba(232, 121, 249, 0.5)',
      badgeBg: 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-500/30'
    },
    amber: {
      text: 'text-amber-400',
      textGlow: 'shadow-[0_0_15px_rgba(251,191,36,0.35)]',
      hex: '#fbbf24',
      glowRgba: 'rgba(251, 191, 36, 0.5)',
      badgeBg: 'bg-amber-950/40 text-amber-400 border-amber-500/30'
    },
  };

  const activeColors = colorMap[accent] || colorMap.red;

  // Shatter / burst reaction when triggered
  useEffect(() => {
    if (triggerBurst) {
      setShattered(true);
      audioEngine.playSweep();
      
      // Auto settle nodes back to standard structure after 2.5 seconds
      const timeout = setTimeout(() => {
        setShattered(false);
        onClearBurst();
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [triggerBurst]);

  // Heartbeat loop trigger
  const beatIntervalMs = (60 / bpm) * 1000;

  useEffect(() => {
    const pulseTrigger = setInterval(() => {
      // Play terminal heartbeat sub-synth synchronized with the pulse
      audioEngine.playHeartbeat(1.1);
    }, beatIntervalMs);

    return () => clearInterval(pulseTrigger);
  }, [bpm, beatIntervalMs]);

  // Framer Motion keyframe configuration for the double-systolic visual heart expansion pulse
  const heartbeatAnimation = {
    scale: [1, 1.05, 0.99, 1.03, 1],
    opacity: [0.94, 1, 0.96, 1, 0.94],
    transition: {
      duration: beatIntervalMs / 1000,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  };

  return (
    <div id="heart-stage-container" className="relative flex items-center justify-center w-full h-[540px] select-none overflow-visible">
      
      {/* Dynamic heart particle core, beating infinitely inside the terminal */}
      <motion.div
        id="beating-heart-core"
        animate={heartbeatAnimation}
        className="relative w-1 h-1 flex items-center justify-center"
      >
        {nodes.map((node) => {
          // Calculate active layout coordinates
          // If shattered, displacement vectors fly out to high radial distance offsets.
          const xPos = shattered ? node.targetX + node.offsetX * 0.9 : node.targetX;
          const yPos = shattered ? node.targetY + node.offsetY * 0.9 : node.targetY;

          // Subtle variation to font weights for matrix organic fidelity
          const isHighGlow = node.glowIntensity === 'high' || hoveredNodeId === node.id;

          return (
            <motion.div
              key={node.id}
              id={node.id}
              initial={{
                x: node.targetX + node.offsetX,
                y: node.targetY + node.offsetY,
                opacity: 0,
                rotate: node.rotation * 4,
                scale: 0.1,
              }}
              animate={{
                x: xPos,
                y: yPos,
                opacity: hoveredNodeId === node.id ? 1 : node.opacity,
                rotate: node.rotation,
                scale: hoveredNodeId === node.id ? 1.35 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: shattered ? 40 : 55,
                damping: shattered ? 12 : 18,
                delay: shattered ? 0 : node.delay * 0.4,
              }}
              onMouseEnter={() => {
                setHoveredNodeId(node.id);
                audioEngine.playClick();
              }}
              onMouseLeave={() => {
                setHoveredNodeId(null);
              }}
              className={`absolute cursor-pointer transition-all duration-150 rounded font-mono select-none px-1 whitespace-nowrap`}
              style={{
                fontSize: `${node.size}px`,
                color: hoveredNodeId === node.id ? '#ffffff' : activeColors.hex,
                textShadow: isHighGlow 
                  ? `0 0 12px ${activeColors.hex}, 0 0 4px ${activeColors.hex}`
                  : `0 0 2px ${activeColors.hex}`,
                fontWeight: isHighGlow ? '700' : '400',
                letterSpacing: '-0.025em',
              }}
            >
              {node.text}
            </motion.div>
          );
        })}

        {/* Central "DECRYPTED" Terminal Badge Overlay inside the exact reserved center cavity */}
        <motion.div
          id="badge-center-overlay"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
          style={{ width: '180px' }}
        >
          <div className={`px-4 py-2 border rounded text-xs font-mono font-bold tracking-[0.25em] text-center back-glow uppercase crt-flicker ${activeColors.badgeBg} border-current`}
               style={{
                 textShadow: `0 0 8px ${activeColors.hex}`,
                 boxShadow: `inset 0 0 10px ${activeColors.glowRgba}`,
               }}>
            <div className="opacity-60 text-[9px] mb-1 font-mono tracking-widest leading-none">HEART STATUS // OK</div>
            DECRYPTED
          </div>
          <div className="flex gap-1.5 mt-2.5">
            <span className={`w-1.5 h-1.5 rounded-full animate-ping`} style={{ backgroundColor: activeColors.hex }}></span>
            <span className="font-mono text-[9px] tracking-wide uppercase opacity-70" style={{ color: activeColors.hex }}>
              Live Biometrics
            </span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
