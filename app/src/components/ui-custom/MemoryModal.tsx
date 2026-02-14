import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Heart, Lock, Sparkles } from 'lucide-react';
import type { Memory } from '@/types';
import { Button } from '@/components/ui/button';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemoryModal({ memory, isOpen, onClose }: MemoryModalProps) {
  if (!memory) return null;

  const typeColors: Record<string, string> = {
    meeting: 'from-pink-500 to-rose-500',
    date: 'from-teal-500 to-cyan-500',
    hangout: 'from-green-500 to-emerald-500',
    chat: 'from-yellow-500 to-amber-500',
    milestone: 'from-red-500 to-pink-500',
  };

  const typeLabels: Record<string, string> = {
    meeting: 'Where We Met',
    date: 'Special Date',
    hangout: 'Our Place',
    chat: 'Late Night Talks',
    milestone: 'Milestone',
  };

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
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className={`h-32 bg-gradient-to-r ${typeColors[memory.type]} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
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
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              <div className="absolute bottom-4 left-6">
                <span className="text-4xl">{memory.icon}</span>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeColors[memory.type]} text-white`}>
                  {typeLabels[memory.type]}
                </span>
                {memory.unlocked ? (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <Sparkles className="w-3 h-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{memory.title}</h2>

              {memory.date && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(memory.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}

              <p className="text-gray-300 leading-relaxed mb-6">
                {memory.description}
              </p>

              {/* Decorative elements */}
              <div className="flex items-center justify-center gap-4 py-4 border-t border-white/10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                </motion.div>
                <span className="text-sm text-gray-400">A precious memory</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                >
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                </motion.div>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
              >
                Close Memory
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
