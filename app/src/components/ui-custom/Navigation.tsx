import { motion } from 'framer-motion';
import React from 'react';
import { 
  Home, 
  TreePine, 
  Building2, 
  Star, 
  Moon, 
  Sun,
  Heart,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentScene: string;
  isNightMode: boolean;
  daysTogether: number;
  onSceneChange: (scene: string) => void;
  onToggleNightMode: () => void;
  onShowFinal: () => void;
  onSecretCodeEnter?: (code: string) => void;
}

const scenes = [
  { id: 'island', label: 'Island', icon: Home },
  { id: 'tree', label: 'Tree', icon: TreePine },
  { id: 'building', label: 'Places', icon: Building2 },
  { id: 'sky', label: 'Stars', icon: Star },
];

export function Navigation({
  currentScene,
  isNightMode,
  daysTogether,
  onSceneChange,
  onToggleNightMode,
  onShowFinal,
  onSecretCodeEnter,
}: NavigationProps) {
  const [secretInput, setSecretInput] = React.useState('');

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretInput.trim() && onSecretCodeEnter) {
      onSecretCodeEnter(secretInput.toLowerCase().trim());
      setSecretInput('');
    }
  };

  return (
    <>
      {/* Top bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-30 p-4"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span className="text-white font-medium hidden sm:inline">Our Living World</span>
          </div>

          {/* Days counter */}
          <motion.div 
            className="glass px-4 py-2 rounded-full flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">
              <span className="font-bold text-pink-400">{daysTogether}</span> days together
            </span>
          </motion.div>

          {/* Night mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleNightMode}
            className="glass rounded-full hover:bg-white/20"
          >
            {isNightMode ? (
              <Moon className="w-5 h-5 text-cyan-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Bottom navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-30 p-4"
      >
        <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
          {/* Scene navigation */}
          <div className="glass p-2 rounded-full flex items-center gap-1">
            {scenes.map((scene) => {
              const Icon = scene.icon;
              const isActive = currentScene === scene.id;
              
              return (
                <Button
                  key={scene.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSceneChange(scene.id)}
                  className={`
                    rounded-full transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{scene.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Final scene button */}
          <Button
            onClick={onShowFinal}
            className="glass bg-gradient-to-r from-pink-500/50 to-rose-500/50 hover:from-pink-500 hover:to-rose-500 text-white rounded-full px-4"
          >
            <Heart className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Forever</span>
          </Button>
        </div>

        {/* Hint text and mobile input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-2"
        >
          {/* Desktop hint */}
          <p className="hidden sm:block text-xs text-gray-500">
            Try typing "forever", "love", or "us" for secrets ✨
          </p>
          
          {/* Mobile input */}
          <form onSubmit={handleSecretSubmit} className="sm:hidden flex items-center justify-center gap-2">
            <input
              type="text"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="Enter secret code..."
              className="glass px-3 py-1 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-3 py-1 text-xs"
            >
              ✨
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
