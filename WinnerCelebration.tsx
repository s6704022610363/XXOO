import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles } from 'lucide-react';
import { Player } from '../types';

interface WinnerCelebrationProps {
  winner: Player | null;
  winnerName: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({ winner, winnerName }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!winner) {
      setParticles([]);
      return;
    }

    const colors =
      winner === 'X'
        ? ['#6366f1', '#38bdf8', '#818cf8', '#fbbf24', '#ffffff']
        : ['#f43f5e', '#fb7185', '#fb923c', '#fbbf24', '#ffffff'];

    const newParticles: Particle[] = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 360,
      y: (Math.random() - 0.5) * 360,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
    }));

    setParticles(newParticles);
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
      {/* Floating particles explosion */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: [0, 1.2, 0.4],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.6,
            delay: p.delay,
            ease: 'easeOut',
          }}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? '50%' : '2px',
          }}
          className="absolute shadow-lg"
        />
      ))}
    </div>
  );
};
