import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Lock, Sparkles, Star } from 'lucide-react';
import type { Star as StarType } from '@/types';
import { Button } from '@/components/ui/button';

interface StarModalProps {
  star: StarType | null;
  isOpen: boolean;
  onClose: () => void;
  secretUnlocked: boolean;
}

export function StarModal({ star, isOpen, onClose, secretUnlocked }: StarModalProps) {
  if (!star) return null;

  const getStarContent = () => {
    switch (star.type) {
      case 'unlocked':
        return {
          title: star.label || 'Memory Star',
          description: 'This star represents a precious moment in our journey together. Each memory we\'ve created shines bright in our constellation.',
          icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
          color: 'from-yellow-400 to-amber-500',
          badge: 'Unlocked Memory',
        };
      case 'future':
        return {
          title: star.label || 'Future Star',
          description: star.date 
            ? `Our next adventure awaits on ${new Date(star.date).toLocaleDateString()}. The best is yet to come!`
            : 'The future holds so many beautiful moments for us to discover together.',
          icon: <Clock className="w-8 h-8 text-cyan-400" />,
          color: 'from-cyan-400 to-teal-500',
          badge: 'Coming Soon',
        };
      case 'locked':
        return {
          title: 'Mystery Star',
          description: 'Our story is still growing... This star will shine when the time is right. Every great love story has its surprises.',
          icon: <Lock className="w-8 h-8 text-gray-400" />,
          color: 'from-gray-500 to-gray-600',
          badge: 'Locked',
        };
      case 'secret':
        if (secretUnlocked) {
          return {
            title: star.label || 'Secret Star',
            description: 'You\'ve unlocked a hidden treasure! This secret star represents the magic that happens when two hearts are truly connected.',
            icon: <Star className="w-8 h-8 text-pink-400 fill-pink-400" />,
            color: 'from-pink-400 to-rose-500',
            badge: 'Secret Unlocked!',
          };
        }
        return {
          title: 'Hidden Star',
          description: 'There\'s a secret waiting to be discovered... Try typing special words to unlock hidden magic!',
          icon: <Lock className="w-8 h-8 text-gray-600" />,
          color: 'from-gray-600 to-gray-700',
          badge: 'Secret',
        };
      default:
        return {
          title: 'Unknown Star',
          description: 'A mysterious star in our constellation.',
          icon: <Star className="w-8 h-8 text-white" />,
          color: 'from-gray-400 to-gray-500',
          badge: 'Unknown',
        };
    }
  };

  const content = getStarContent();

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
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md glass rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Starry background */}
            <div className={`h-40 bg-gradient-to-br ${content.color} relative overflow-hidden`}>
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              {/* Central star icon */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-white/50 rounded-full" />
                  {content.icon}
                </div>
              </motion.div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${content.color} text-white`}>
                  {content.badge}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">{content.title}</h2>

              {star.date && star.type === 'future' && (
                <div className="flex items-center gap-2 text-sm text-cyan-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(star.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}

              <p className="text-gray-300 leading-relaxed mb-6">
                {content.description}
              </p>

              {/* Countdown for future stars */}
              {star.type === 'future' && star.date && (
                <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-cyan-300 mb-2">Countdown to our next moment:</p>
                  <CountdownTimer targetDate={star.date} />
                </div>
              )}

              {/* Hint for secret stars */}
              {star.type === 'secret' && !secretUnlocked && (
                <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-4 mb-6">
                  <p className="text-sm text-pink-300">
                    💫 Hint: Try typing words like "forever", "love", or "us" anywhere on the page!
                  </p>
                </div>
              )}

              <Button
                onClick={onClose}
                className={`w-full bg-gradient-to-r ${content.color} hover:opacity-90 text-white`}
              >
                {star.type === 'locked' ? 'Keep Exploring' : 'Close'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="flex justify-center gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{days}</div>
        <div className="text-xs text-cyan-300">Days</div>
      </div>
      <div className="text-2xl font-bold text-white">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{hours}</div>
        <div className="text-xs text-cyan-300">Hours</div>
      </div>
      <div className="text-2xl font-bold text-white">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{minutes}</div>
        <div className="text-xs text-cyan-300">Minutes</div>
      </div>
    </div>
  );
}
