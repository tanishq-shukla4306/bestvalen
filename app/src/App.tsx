import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene3D } from '@/components/three/Scene3D';
import { OpeningScene } from '@/components/ui-custom/OpeningScene';
import { FinalScene } from '@/components/ui-custom/FinalScene';
import { Navigation } from '@/components/ui-custom/Navigation';
import { MemoryModal } from '@/components/ui-custom/MemoryModal';
import { StarModal } from '@/components/ui-custom/StarModal';
import { SecretModal } from '@/components/ui-custom/SecretModal';
import { Fireworks } from '@/components/ui-custom/Fireworks';
import { useGameState } from '@/hooks/useGameState';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const {
    sceneState,
    memories,
    stars,
    daysTogether,
    secrets,
    showSecretModal,
    secretReward,
    setScene,
    selectBuilding,
    selectStar,
    toggleNightMode,
    setShowSecretModal,
  } = useGameState();

  const [showOpening, setShowOpening] = useState(true);
  const [showFinal, setShowFinal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<typeof memories[0] | null>(null);
  const [selectedStarData, setSelectedStarData] = useState<typeof stars[0] | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  // Handle start button
  const handleStart = useCallback(() => {
    setShowOpening(false);
    setScene('island');
    toast.success('Welcome to our world! 💕', {
      description: 'Drag to explore, click to discover memories',
    });
  }, [setScene]);

  // Handle building click
  const handleBuildingClick = useCallback((memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
      setSelectedMemory(memory);
      setShowMemoryModal(true);
      selectBuilding(memoryId);
      setScene('building');
    }
  }, [memories, selectBuilding, setScene]);

  // Handle star click
  const handleStarClick = useCallback((starId: string) => {
    const star = stars.find(s => s.id === starId);
    if (star) {
      setSelectedStarData(star);
      setShowStarModal(true);
      selectStar(starId);
      
      if (star.type === 'locked') {
        toast.info('This star is not yet unlocked', {
          description: 'Our story is still growing...',
        });
      }
    }
  }, [stars, selectStar]);

  // Handle branch click
  const handleBranchClick = useCallback((_branchId: string) => {
    toast.success('Tree milestone discovered! 🌳', {
      description: 'Every branch represents a moment in our journey',
    });
  }, []);

  // Handle scene change from navigation
  const handleSceneChange = useCallback((scene: string) => {
    setScene(scene as any);
    selectBuilding(null);
    selectStar(null);
  }, [setScene, selectBuilding, selectStar]);

  // Handle show final scene
  const handleShowFinal = useCallback(() => {
    setShowFinal(true);
    setScene('final');
  }, [setScene]);

  // Handle replay
  const handleReplay = useCallback(() => {
    setShowFinal(false);
    setScene('island');
    setShowFireworks(false);
  }, [setScene]);

  // Handle secret modal close
  const handleSecretModalClose = useCallback(() => {
    setShowSecretModal(false);
    if (secretReward === 'fireworks') {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 5000);
    }
  }, [secretReward, setShowSecretModal]);

  // Listen for secret unlocks
  useEffect(() => {
    const unlockedSecret = secrets.find(s => s.unlocked);
    if (unlockedSecret && !showSecretModal) {
      if (unlockedSecret.reward === 'fireworks') {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 5000);
      }
    }
  }, [secrets, showSecretModal]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a1a]">
      <Toaster position="top-center" richColors />

      {/* Opening Scene */}
      <AnimatePresence>
        {showOpening && (
          <OpeningScene onStart={handleStart} />
        )}
      </AnimatePresence>

      {/* Final Scene */}
      <AnimatePresence>
        {showFinal && (
          <FinalScene 
            onReplay={handleReplay} 
            daysTogether={daysTogether}
          />
        )}
      </AnimatePresence>

      {/* Main 3D Scene */}
      {!showOpening && !showFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Scene3D
            currentScene={sceneState.currentScene}
            memories={memories}
            stars={stars}
            daysTogether={daysTogether}
            isNightMode={sceneState.isNightMode}
            secretUnlocked={sceneState.secretUnlocked}
            selectedBuilding={sceneState.selectedBuilding}
            onBuildingClick={handleBuildingClick}
            onStarClick={handleStarClick}
            onBranchClick={handleBranchClick}
          />
        </motion.div>
      )}

      {/* Navigation (only show when not in opening/final) */}
      {!showOpening && !showFinal && (
        <Navigation
          currentScene={sceneState.currentScene}
          isNightMode={sceneState.isNightMode}
          daysTogether={daysTogether}
          onSceneChange={handleSceneChange}
          onToggleNightMode={toggleNightMode}
          onShowFinal={handleShowFinal}
        />
      )}

      {/* Modals */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={showMemoryModal}
        onClose={() => {
          setShowMemoryModal(false);
          selectBuilding(null);
        }}
      />

      <StarModal
        star={selectedStarData}
        isOpen={showStarModal}
        onClose={() => {
          setShowStarModal(false);
          selectStar(null);
        }}
        secretUnlocked={sceneState.secretUnlocked}
      />

      <SecretModal
        isOpen={showSecretModal}
        onClose={handleSecretModalClose}
        reward={secretReward}
      />

      {/* Fireworks effect */}
      <Fireworks active={showFireworks} />

      {/* Secret code indicator */}
      {!showOpening && !showFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="glass px-4 py-2 rounded-full text-xs text-gray-400">
            {sceneState.isNightMode ? '🌙 Night Mode' : '☀️ Day Mode'}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
