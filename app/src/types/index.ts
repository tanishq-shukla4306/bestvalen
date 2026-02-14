export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'meeting' | 'date' | 'hangout' | 'chat' | 'milestone';
  icon: string;
  position: { x: number; z: number };
  unlocked: boolean;
}

export interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'unlocked' | 'future' | 'locked' | 'secret';
  memoryId?: string;
  connectedTo: string[];
  label?: string;
  date?: string;
}

export interface TreeNode {
  id: string;
  x: number;
  y: number;
  type: 'leaf' | 'flower' | 'branch';
  message?: string;
  dayNumber?: number;
  milestone?: string;
}

export interface SceneState {
  currentScene: 'opening' | 'island' | 'tree' | 'building' | 'sky' | 'final';
  selectedBuilding: string | null;
  selectedStar: string | null;
  isNightMode: boolean;
  secretUnlocked: boolean;
  cameraPosition: { x: number; y: number; z: number };
}

export interface SecretCode {
  code: string;
  unlocked: boolean;
  reward: 'fireworks' | 'star' | 'letter';
}

export interface Firework {
  id: string;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
