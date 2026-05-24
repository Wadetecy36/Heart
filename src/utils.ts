import { HeartTextNode } from './types';

// Parametric formula for a 3D-feeling flat heart shape
// x = 16 * sin^3(t)
// y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
export function generateHeartNodes(
  text: string = "i love you",
  densityFactor: number = 1.0
): HeartTextNode[] {
  const nodes: HeartTextNode[] = [];
  let nodeId = 0;

  // We want to create concentric layers of heart contours for depth,
  // scaling from outer bounds (1.0) down to inner levels.
  const layers = [
    { scale: 1.0, count: Math.round(75 * densityFactor) },
    { scale: 0.85, count: Math.round(65 * densityFactor) },
    { scale: 0.70, count: Math.round(50 * densityFactor) },
    { scale: 0.52, count: Math.round(40 * densityFactor) },
    { scale: 0.35, count: Math.round(25 * densityFactor) },
    { scale: 0.18, count: Math.round(10 * densityFactor) },
  ];

  // Bounding rectangle check for the DECRYPTED slot in the center.
  // Center is at coordinate (0, 0).
  // x bounding: [-90, 90] pixels; y bounding: [-35, 30] pixels.
  // Since we scale the heart below, we can do the bounding check on absolute visual positions.
  const heartScaleWidth = 14.5;
  const heartScaleHeight = -14.5; // positive is up in standard coordinates, so we multiply by negative for screen y-axis (down is positive)

  layers.forEach((layer) => {
    const { scale, count } = layer;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 * Math.PI;

      // Parametric coordinates
      const rawX = 16 * Math.pow(Math.sin(t), 3);
      const rawY =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      // Scale and apply to visual layout size
      let targetX = rawX * heartScaleWidth * scale;
      let targetY = rawY * heartScaleHeight * scale;

      // Lift the center slightly to adjust for heart center of mass alignment
      targetY += 30;

      // Check if coordinate falls inside the central "DECRYPTED" horizontal overlay text zone.
      // We want to reserve a rectangle around center of width ~170px and height ~65px.
      const bufferX = 110;
      const bufferY = 32;
      if (Math.abs(targetX) < bufferX && Math.abs(targetY) < bufferY) {
        // Skip adding node inside the centered badge zone to leave it perfectly clean
        continue;
      }

      // Slightly perturb points for organic spacing, making it feel less mechanical
      targetX += (Math.random() - 0.5) * 8;
      targetY += (Math.random() - 0.5) * 8;

      // Random starting offset for scattered start state (de-fragmented / scrambled)
      // They will fly in from random, faraway points during decryption
      const angle = Math.random() * Math.PI * 2;
      const distance = 400 + Math.random() * 500;
      const startOffsetX = Math.cos(angle) * distance;
      const startOffsetY = Math.sin(angle) * distance;

      // Font size variations for depth: outer particles are slightly smaller/faded
      // inside is dense, some key nodes glow brighter.
      const sizeMultiplier = scale > 0.7 ? 0.95 : scale < 0.3 ? 0.8 : 1.1;
      const baseSize = 8.5 + Math.random() * 3.5;
      const finalSize = Math.round(baseSize * sizeMultiplier);

      const rotation = -8 + Math.random() * 16; // soft organic rotate
      const opacity = scale > 0.8 ? 0.55 + Math.random() * 0.25 : 0.75 + Math.random() * 0.25;

      const glowIntensity: 'low' | 'medium' | 'high' = 
        Math.random() > 0.85 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';

      nodes.push({
        id: `h-node-${nodeId++}`,
        targetX,
        targetY,
        offsetX: startOffsetX,
        offsetY: startOffsetY,
        text,
        size: finalSize,
        opacity,
        rotation,
        glowIntensity,
        delay: Math.random() * 0.5, // stagger entry
      });
    }
  });

  return nodes;
}

// Generates retro command-line diagnostic messages that loop or scroll.
export const BOOT_LOGS_PRESETS = [
  "LOCKING PROTOCOL INITIALIZED ON PORT 3000...",
  "SECURE MEMORY SEGMENT: 0xDEADBEEF ALLOCATED.",
  "SCANNING DECODER MATRICES... EMOTION MATRIX STABLE.",
  "SIGNAL FIDELITY ACQUISITION: CONTINUOUS (144.2 dB)",
  "WARNING: ORGANIC CORRELATOR REQUIRES INTEGRATION KEY.",
  "DUMPING EMOTIONAL CORE TELEMETRY...",
  "BEAT RECEPTIONS DETECTED FOR INTENSITY LEVEL: 100%",
  "DECRYPTION KEY NOT REGISTERED.",
  "ATTEMPTING TO ROUTE PASSCODE TO EMOTIONAL SHELL...",
  "SECTOR DPF-420 SYNAPSE LINK ONLINE.",
  "INITIALIZING COGNITIVE BREAK ENGINE...",
];

export const DECRYPTING_LOGS_PRESETS = [
  "INJECTING BREAKER DECODER KEY AT PORT 3000...",
  "BYPASSING CRYPTO THREADS [0xFA488FF9A]...",
  "METICULOUS EMOTIONAL ENCRYPT SECTOR IDENTIFIED.",
  "INTEGRATING HEART CONTUOR EQUATION PARAMETRICS...",
  "DIAGNOSIC: DETECTING ACCENT RESONANCE CORE...",
  "SYNAPSE LINKAGE ESTABLISHED AT 1024Hz VIBRANCY.",
  "PARSING CORE MESSAGES... LEVEL 23 DECRYPTION...",
  "CORRELATING USER PULSE LOGS... 420 SAMPLES FOUND.",
  "ALLOCATING MEMORY SLOTS FOR SUB-SINE HEARTS...",
  "BUFFER OVERFLOW: OVERFLOWING WITH CARING SYSTEM...",
  "UNLEASHING PARTICLE DISSIPATE FIELDS...",
  "EMOTION BUFFERING RATIO IN EXCESS: REDIRECTION COMPLETED.",
  "DECRYPTED MATRIX SECTOR // HEARTBEAT LOCK COMPLETED // SUCCESS.",
];
