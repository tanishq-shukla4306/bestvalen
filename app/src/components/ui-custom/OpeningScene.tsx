import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OpeningSceneProps {
  onStart: () => void;
}

export function OpeningScene({ onStart }: OpeningSceneProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3e] to-[#2d1b4e]">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: '-50px',
            }}
            animate={{
              y: [-100, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            <Heart 
              className="text-pink-500/30 fill-pink-500/30" 
              size={20 + Math.random() * 30}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* Decorative sparkles */}
        <motion.div
          className="absolute -top-20 -left-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-16 h-16 text-yellow-400/50" />
        </motion.div>
        <motion.div
          className="absolute -bottom-10 -right-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-12 h-12 text-pink-400/50" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Our Living</span>
            <br />
            <span className="text-white">Little World</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl text-gray-300 mb-4 italic"
        >
          "This is the world we've been building…
          <br />
          moment by moment."
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-32 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mx-auto mb-8 rounded-full"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-gray-400 mb-10 max-w-md mx-auto"
        >
          Explore our floating island, discover the tree that grows with our love, 
          visit the places where memories were made, and gaze at the constellation 
          of our journey together.
        </motion.p>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="group relative px-8 py-6 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-full overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Enter Our World
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </Button>
        </motion.div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8 text-sm text-gray-500"
        >
          💫 Drag to explore • Click to discover • Type secrets to unlock magic
        </motion.p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
    </div>
  );
}
