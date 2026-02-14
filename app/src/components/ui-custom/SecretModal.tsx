import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Star, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: string | null;
}

export function SecretModal({ isOpen, onClose, reward }: SecretModalProps) {
  const getRewardContent = () => {
    switch (reward) {
      case 'fireworks':
        return {
          title: 'Fireworks of Love!',
          description: 'You\'ve unlocked a spectacular display! Just like fireworks, our love lights up the sky with beautiful colors.',
          icon: <Sparkles className="w-12 h-12 text-yellow-400" />,
          color: 'from-yellow-400 via-orange-500 to-red-500',
          message: '✨ Watch the sky light up with our love! ✨',
        };
      case 'star':
        return {
          title: 'Secret Star Unlocked!',
          description: 'A hidden star has appeared in our constellation! It represents the secret magic that only we share.',
          icon: <Star className="w-12 h-12 text-pink-400 fill-pink-400" />,
          color: 'from-pink-400 via-purple-500 to-indigo-500',
          message: '⭐ A new star shines for us! ⭐',
        };
      case 'letter':
        return {
          title: 'A Secret Letter',
          description: 'Words from the heart, hidden until now. This is a message meant just for you.',
          icon: <Mail className="w-12 h-12 text-rose-400" />,
          color: 'from-rose-400 via-pink-500 to-purple-500',
          message: '💌 A special message awaits... 💌',
        };
      default:
        return {
          title: 'Secret Unlocked!',
          description: 'You\'ve discovered something special!',
          icon: <Heart className="w-12 h-12 text-red-400 fill-red-400" />,
          color: 'from-red-400 via-pink-500 to-rose-500',
          message: '❤️ Magic is in the air! ❤️',
        };
    }
  };

  const content = getRewardContent();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={onClose}
        >
          {/* Fireworks effect */}
          {reward === 'fireworks' && <FireworksEffect />}

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg glass rounded-2xl overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated gradient background */}
            <div className={`h-48 bg-gradient-to-br ${content.color} relative overflow-hidden`}>
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Central icon */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity }
                }}
              >
                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 blur-2xl bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {content.icon}
                </div>
              </motion.div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <motion.h2 
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {content.title}
              </motion.h2>

              <motion.p 
                className="text-lg text-gray-300 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {content.description}
              </motion.p>

              <motion.div
                className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${content.color} text-white font-medium mb-6`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                {content.message}
              </motion.div>

              {/* Secret letter content */}
              {reward === 'letter' && (
                <motion.div
                  className="bg-white/10 rounded-xl p-6 mb-6 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-rose-300 italic leading-relaxed">
                    "Every moment with you feels like a dream I never want to wake up from. 
                    You are my today and all of my tomorrows. I love you more than words can express, 
                    and I can't wait to create more beautiful memories together."
                  </p>
                  <p className="text-right text-rose-400 mt-4">— With all my love</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className={`w-full bg-gradient-to-r ${content.color} hover:opacity-90 text-white py-6 text-lg`}
                >
                  Continue Our Journey
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FireworksEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <Firework key={i} delay={i * 0.3} />
      ))}
    </div>
  );
}

function Firework({ delay }: { delay: number }) {
  const colors = ['#ff6b9d', '#4ecdc4', '#ffe66d', '#ff8b94', '#a8e6cf'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.random() * 100;
  const y = 20 + Math.random() * 60;

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ delay, duration: 2, repeat: 2 }}
    >
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              x: [0, Math.cos(angle) * distance],
              y: [0, Math.sin(angle) * distance],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ delay: delay + 0.2, duration: 1, ease: 'easeOut' }}
          />
        );
      })}
    </motion.div>
  );
}
