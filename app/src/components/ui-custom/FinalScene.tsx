import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinalSceneProps {
  onReplay: () => void;
  daysTogether: number;
}

export function FinalScene({ onReplay, daysTogether }: FinalSceneProps) {
  // Generate name in stars effect
  const nameLetters = ['Y', 'O', 'U'];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3e] to-[#2d1b4e]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
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

      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <motion.line
          x1="20%"
          y1="30%"
          x2="35%"
          y2="25%"
          stroke="#4ecdc4"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.line
          x1="35%"
          y1="25%"
          x2="50%"
          y2="30%"
          stroke="#4ecdc4"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.line
          x1="50%"
          y1="30%"
          x2="65%"
          y2="25%"
          stroke="#4ecdc4"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <motion.line
          x1="65%"
          y1="25%"
          x2="80%"
          y2="30%"
          stroke="#4ecdc4"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 2 }}
        />
      </svg>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        {/* Sparkle decorations */}
        <motion.div
          className="absolute -top-16 left-1/4"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 20, repeat: Infinity }, scale: { duration: 2, repeat: Infinity } }}
        >
          <Sparkles className="w-12 h-12 text-yellow-400/60" />
        </motion.div>
        <motion.div
          className="absolute -top-8 right-1/4"
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ rotate: { duration: 15, repeat: Infinity }, scale: { duration: 2.5, repeat: Infinity } }}
        >
          <Sparkles className="w-10 h-10 text-pink-400/60" />
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <p className="text-2xl md:text-3xl text-gray-300 mb-6 italic leading-relaxed">
            "We didn't just share moments…
            <br />
            <span className="text-gradient font-semibold">we built a world.</span>"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
            And I want to keep living in it
            <br />
            <span className="text-pink-400">with you.</span>
          </p>
        </motion.div>

        {/* Days together counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-4 glass px-8 py-4 rounded-2xl">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500 animate-pulse" />
            <div className="text-left">
              <p className="text-3xl font-bold text-white">{daysTogether}</p>
              <p className="text-sm text-gray-400">days of love</p>
            </div>
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Name in stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="mb-10"
        >
          <p className="text-sm text-gray-500 mb-4">Written in the stars...</p>
          <div className="flex justify-center gap-4">
            {nameLetters.map((letter, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5 + i * 0.3, type: 'spring' }}
                className="relative"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                </motion.div>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#0a0a1a]">
                  {letter}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Replay button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5 }}
        >
          <Button
            onClick={onReplay}
            size="lg"
            className="group px-8 py-6 text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white rounded-full"
          >
            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Explore Again
            <Sparkles className="w-5 h-5 ml-2 group-hover:-rotate-12 transition-transform" />
          </Button>
        </motion.div>

        {/* Footer message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
          className="mt-8 text-sm text-gray-500"
        >
          Forever and always 💕
        </motion.p>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
    </div>
  );
}
