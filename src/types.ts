export type SystemState = 'locked' | 'decrypting' | 'decrypted';

export type AccentColor = 'red' | 'cyan' | 'green' | 'purple' | 'amber';

export interface TerminalLog {
  id: string;
  text: string;
  type: 'info' | 'warn' | 'success' | 'system';
  timestamp: string;
}

export interface HeartTextNode {
  id: string;
  // Final target coordinates relative to parent center (percentage or px)
  targetX: number;
  targetY: number;
  // Burst/scatter temporary offset
  offsetX: number;
  offsetY: number;
  // Specific word to display (defaults to "i love you" or customized)
  text: string;
  size: number; // Font size in px
  opacity: number;
  rotation: number; // Subtle tilt for organic form
  glowIntensity: 'low' | 'medium' | 'high';
  delay: number; // Staggered entrance
}
