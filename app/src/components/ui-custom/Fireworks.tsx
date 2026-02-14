import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FireworkParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

interface Firework {
  id: string;
  x: number;
  y: number;
  particles: FireworkParticle[];
}

interface FireworksProps {
  active: boolean;
}

const colors = ['#ff6b9d', '#4ecdc4', '#ffe66d', '#ff8b94', '#a8e6cf', '#ff4757', '#7bed9f'];

export function Fireworks({ active }: FireworksProps) {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    if (!active) {
      setFireworks([]);
      return;
    }

    // Create initial fireworks
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createFirework();
      }, i * 500);
    }

    // Continue creating fireworks
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        createFirework();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [active]);

  const createFirework = () => {
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 50;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const particles: FireworkParticle[] = [];
    const particleCount = 20 + Math.floor(Math.random() * 15);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 2 + Math.random() * 3;
      particles.push({
        id: `p-${Date.now()}-${i}`,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        life: 1,
      });
    }

    const newFirework: Firework = {
      id: `fw-${Date.now()}`,
      x,
      y,
      particles,
    };

    setFireworks(prev => [...prev.slice(-4), newFirework]);

    // Remove firework after animation
    setTimeout(() => {
      setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
    }, 2000);
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {fireworks.map(firework => (
          <FireworkDisplay key={firework.id} firework={firework} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FireworkDisplay({ firework }: { firework: Firework }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${firework.x}%`,
        top: `${firework.y}%`,
      }}
    >
      {firework.particles.map((particle, i) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: particle.vx * 30,
            y: particle.vy * 30,
            opacity: [1, 1, 0],
            scale: [1, 0.5, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
            delay: i * 0.01,
          }}
        />
      ))}
      
      {/* Center flash */}
      <motion.div
        className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: firework.particles[0]?.color || '#fff' }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 3, 0], opacity: [1, 0.5, 0] }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
