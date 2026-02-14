import { useState, useCallback, useEffect } from 'react';
import type { SceneState, Memory, Star, SecretCode } from '@/types';

const initialMemories: Memory[] = [
  {
    id: 'meeting',
    title: 'Where We Met',
    description: 'The moment our eyes first met, the world seemed to pause. In that crowded room, it felt like destiny had finally found us.',
    date: '2023-06-15',
    type: 'meeting',
    icon: '🏡',
    position: { x: -3, z: -2 },
    unlocked: true,
  },
  {
    id: 'first-date',
    title: 'Our First Date',
    description: 'Coffee, laughter, and hours that felt like minutes. We talked until the café closed, not wanting the night to end.',
    date: '2023-06-22',
    type: 'date',
    icon: '☕',
    position: { x: 3, z: -1 },
    unlocked: true,
  },
  {
    id: 'hangout',
    title: 'Our Special Day',
    description: 'The day i will never forget throuout my life .....the very special day of my life .....jb humne apni feelings share ki thi .....the day you start trusting me the most .....and believe  me Budhu   i will never break it .....ye voh din h jisle liye mai bhagwanji roz thank you bolta hun ki unhone uss din aisi situation banayi ki mai aapse baat kr paya aur mai aapse apni feeling express kr paya',
    date: '2024-12-22',
    type: 'hangout',
    icon: '🌳',
    position: { x: -2, z: 3 },
    unlocked: true,
  },
  {
    id: 'chats',
    title: 'Late Night Talks',
    description: 'Countless messages, voice notes, and video calls. Every word brought us closer, bridging the distance between our hearts.',
    date: '2023-08-01',
    type: 'chat',
    icon: '💬',
    position: { x: 2, z: 2 },
    unlocked: true,
  },
  {
    id: 'milestone',
    title: 'One Year Together',
    description: '365 days of love, growth, and endless memories. Here\'s to many more years of building our world together.',
    date: '2024-06-15',
    type: 'milestone',
    icon: '💕',
    position: { x: 0, z: -3 },
    unlocked: true,
  },
];

const initialStars: Star[] = [
  { id: 'star-1', x: 100, y: 80, size: 4, type: 'unlocked', memoryId: 'meeting', connectedTo: ['star-2'], label: 'First Meeting' },
  { id: 'star-2', x: 200, y: 120, size: 5, type: 'unlocked', memoryId: 'first-date', connectedTo: ['star-3'], label: 'First Date' },
  { id: 'star-3', x: 320, y: 90, size: 4, type: 'unlocked', memoryId: 'hangout', connectedTo: ['star-4'], label: 'Special Day' },
  { id: 'star-4', x: 440, y: 140, size: 5, type: 'unlocked', memoryId: 'chats', connectedTo: ['star-5'], label: 'Late Nights' },
  { id: 'star-5', x: 560, y: 100, size: 6, type: 'unlocked', memoryId: 'milestone', connectedTo: ['star-6'], label: 'One Year' },
  { id: 'star-6', x: 680, y: 80, size: 4, type: 'future', connectedTo: ['star-7'], label: 'Next Adventure', date: '2025-06-15' },
  { id: 'star-7', x: 780, y: 120, size: 3, type: 'locked', connectedTo: [], label: 'Future Mystery' },
  { id: 'star-secret', x: 400, y: 40, size: 8, type: 'secret', connectedTo: [], label: 'Secret Star' },
];

const secretCodes: SecretCode[] = [
  { code: 'forever', unlocked: false, reward: 'fireworks' },
  { code: 'love', unlocked: false, reward: 'star' },
  { code: 'us', unlocked: false, reward: 'letter' },
];

export function useGameState() {
  const [sceneState, setSceneState] = useState<SceneState>({
    currentScene: 'opening',
    selectedBuilding: null,
    selectedStar: null,
    isNightMode: false,
    secretUnlocked: false,
    cameraPosition: { x: 0, y: 15, z: 20 },
  });

  const [memories] = useState<Memory[]>(initialMemories);
  const [stars, setStars] = useState<Star[]>(initialStars);
  const [secrets, setSecrets] = useState<SecretCode[]>(secretCodes);
  const [typedCode, setTypedCode] = useState('');
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretReward, setSecretReward] = useState<string | null>(null);

  // Calculate days together
  const startDate = new Date('2023-06-15');
  const today = new Date();
  const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const setScene = useCallback((scene: SceneState['currentScene']) => {
    setSceneState(prev => ({ ...prev, currentScene: scene }));
  }, []);

  const selectBuilding = useCallback((buildingId: string | null) => {
    setSceneState(prev => ({ ...prev, selectedBuilding: buildingId }));
  }, []);

  const selectStar = useCallback((starId: string | null) => {
    setSceneState(prev => ({ ...prev, selectedStar: starId }));
  }, []);

  const toggleNightMode = useCallback(() => {
    setSceneState(prev => ({ ...prev, isNightMode: !prev.isNightMode }));
  }, []);

  const unlockSecret = useCallback((code: string) => {
    const secret = secrets.find(s => s.code === code && !s.unlocked);
    if (secret) {
      setSecrets(prev => prev.map(s => 
        s.code === code ? { ...s, unlocked: true } : s
      ));
      setSceneState(prev => ({ ...prev, secretUnlocked: true }));
      setSecretReward(secret.reward);
      setShowSecretModal(true);
      
      // Unlock secret star
      if (secret.reward === 'star') {
        setStars(prev => prev.map(s => 
          s.id === 'star-secret' ? { ...s, type: 'unlocked' as const } : s
        ));
      }
      return true;
    }
    return false;
  }, [secrets]);

  // Handle secret code typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        setTypedCode(prev => {
          const newCode = (prev + e.key.toLowerCase()).slice(-10);
          // Check for secret codes
          secretCodes.forEach(secret => {
            if (newCode.includes(secret.code)) {
              unlockSecret(secret.code);
              return '';
            }
          });
          return newCode;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlockSecret]);

  return {
    sceneState,
    memories,
    stars,
    secrets,
    daysTogether,
    typedCode,
    showSecretModal,
    secretReward,
    setScene,
    selectBuilding,
    selectStar,
    toggleNightMode,
    unlockSecret,
    setShowSecretModal,
    setSecretReward,
  };
}
