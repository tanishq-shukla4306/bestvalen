import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import type { Memory } from '@/types';

interface MemoryBuildingsProps {
  memories: Memory[];
  isNightMode: boolean;
  onBuildingClick: (memoryId: string) => void;
  selectedBuilding: string | null;
}

const buildingColors: Record<string, string> = {
  meeting: '#ff6b9d',
  date: '#4ecdc4',
  hangout: '#7cb342',
  chat: '#ffe66d',
  milestone: '#ff8b94',
};

const buildingShapes: Record<string, string> = {
  meeting: 'house',
  date: 'cafe',
  hangout: 'gazebo',
  chat: 'tower',
  milestone: 'monument',
};

export function MemoryBuildings({ 
  memories, 
  isNightMode, 
  onBuildingClick,
  selectedBuilding 
}: MemoryBuildingsProps) {
  return (
    <group>
      {memories.map((memory) => (
        <Building
          key={memory.id}
          memory={memory}
          isNightMode={isNightMode}
          onClick={() => onBuildingClick(memory.id)}
          isSelected={selectedBuilding === memory.id}
        />
      ))}
    </group>
  );
}

interface BuildingProps {
  memory: Memory;
  isNightMode: boolean;
  onClick: () => void;
  isSelected: boolean;
}

function Building({ memory, isNightMode, onClick, isSelected }: BuildingProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle float animation
  useFrame((state) => {
    if (groupRef.current) {
      const offset = memory.id.charCodeAt(0);
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.05;
    }
  });

  const color = buildingColors[memory.type];
  const shape = buildingShapes[memory.type];
  const position = new Vector3(memory.position.x, 0.5, memory.position.z);

  return (
    <group 
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={isSelected ? 1.2 : hovered ? 1.1 : 1}
    >
      {/* Building base/platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 8]} />
        <meshStandardMaterial 
          color={isNightMode ? '#2d2d44' : '#8b7355'}
          roughness={0.8}
        />
      </mesh>

      {/* Building structure based on type */}
      {shape === 'house' && (
        <HouseShape color={color} isNightMode={isNightMode} />
      )}
      {shape === 'cafe' && (
        <CafeShape color={color} isNightMode={isNightMode} />
      )}
      {shape === 'gazebo' && (
        <GazeboShape color={color} isNightMode={isNightMode} />
      )}
      {shape === 'tower' && (
        <TowerShape color={color} isNightMode={isNightMode} />
      )}
      {shape === 'monument' && (
        <MonumentShape color={color} isNightMode={isNightMode} />
      )}

      {/* Glow effect when night mode */}
      {isNightMode && (
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}

      {/* Selection ring */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.1, 32]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

function HouseShape({ color, isNightMode }: { color: string; isNightMode: boolean }) {
  return (
    <>
      {/* Main house body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 0.8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.7}
        />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.8, 0.5, 4]} />
        <meshStandardMaterial 
          color={isNightMode ? '#4a4a5a' : '#8b4513'}
          roughness={0.9}
        />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.3, 0.41]}>
        <planeGeometry args={[0.25, 0.4]} />
        <meshStandardMaterial 
          color={isNightMode ? '#3d2817' : '#5d3a1a'}
        />
      </mesh>
      {/* Windows with glow in night mode */}
      <mesh position={[-0.25, 0.7, 0.41]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial 
          color={isNightMode ? '#ffe66d' : '#87ceeb'}
          emissive={isNightMode ? '#ffe66d' : '#000000'}
          emissiveIntensity={isNightMode ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0.25, 0.7, 0.41]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial 
          color={isNightMode ? '#ffe66d' : '#87ceeb'}
          emissive={isNightMode ? '#ffe66d' : '#000000'}
          emissiveIntensity={isNightMode ? 0.5 : 0}
        />
      </mesh>
    </>
  );
}

function CafeShape({ color, isNightMode }: { color: string; isNightMode: boolean }) {
  return (
    <>
      {/* Cafe building */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.6}
        />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 0.9, 0.5]} castShadow>
        <boxGeometry args={[1.3, 0.1, 0.4]} />
        <meshStandardMaterial 
          color="#ff6b9d"
          roughness={0.8}
        />
      </mesh>
      {/* Awning stripes */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[-0.5 + i * 0.25, 0.95, 0.5]}>
          <boxGeometry args={[0.1, 0.15, 0.41]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#ffffff' : '#ff6b9d'}
          />
        </mesh>
      ))}
      {/* Window */}
      <mesh position={[0, 0.6, 0.41]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshStandardMaterial 
          color={isNightMode ? '#ffe66d' : '#87ceeb'}
          emissive={isNightMode ? '#ffe66d' : '#000000'}
          emissiveIntensity={isNightMode ? 0.5 : 0}
        />
      </mesh>
      {/* Coffee cup sign */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </>
  );
}

function GazeboShape({ color, isNightMode }: { color: string; isNightMode: boolean }) {
  return (
    <>
      {/* Platform */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Pillars */}
      {[-0.5, 0.5].map((x) =>
        [-0.5, 0.5].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.7, z]}>
            <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
            <meshStandardMaterial 
              color={isNightMode ? '#4a4a5a' : '#8b7355'}
            />
          </mesh>
        ))
      )}
      {/* Roof */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.9, 0.4, 4]} />
        <meshStandardMaterial 
          color={isNightMode ? '#4a4a5a' : '#2d5a3d'}
        />
      </mesh>
      {/* Hanging lights */}
      {[-0.5, 0.5].map((x) =>
        [-0.5, 0.5].map((z) => (
          <mesh key={`light-${x}-${z}`} position={[x, 1, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color={isNightMode ? '#ffe66d' : '#ffffff'}
              emissive={isNightMode ? '#ffe66d' : '#000000'}
              emissiveIntensity={isNightMode ? 0.8 : 0}
            />
          </mesh>
        ))
      )}
    </>
  );
}

function TowerShape({ color, isNightMode }: { color: string; isNightMode: boolean }) {
  return (
    <>
      {/* Main tower */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.6}
        />
      </mesh>
      {/* Top platform */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 8]} />
        <meshStandardMaterial 
          color={isNightMode ? '#4a4a5a' : '#8b7355'}
        />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      {/* Signal light */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color={isNightMode ? '#ff6b9d' : '#ff0000'}
          emissive={isNightMode ? '#ff6b9d' : '#000000'}
          emissiveIntensity={isNightMode ? 1 : 0}
        />
      </mesh>
      {/* Windows */}
      {[0.5, 0.9, 1.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.31]}>
          <planeGeometry args={[0.15, 0.2]} />
          <meshStandardMaterial 
            color={isNightMode ? '#ffe66d' : '#87ceeb'}
            emissive={isNightMode ? '#ffe66d' : '#000000'}
            emissiveIntensity={isNightMode ? 0.5 : 0}
          />
        </mesh>
      ))}
    </>
  );
}

function MonumentShape({ color, isNightMode }: { color: string; isNightMode: boolean }) {
  return (
    <>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial 
          color={isNightMode ? '#4a4a5a' : '#8b7355'}
        />
      </mesh>
      {/* Pillar */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.5}
        />
      </mesh>
      {/* Top ornament */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#ffe66d"
          emissive={isNightMode ? '#ffe66d' : '#000000'}
          emissiveIntensity={isNightMode ? 0.8 : 0}
        />
      </mesh>
      {/* Heart shape (simplified as rotated spheres) */}
      <mesh position={[-0.08, 1.5, 0.15]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff6b9d" />
      </mesh>
      <mesh position={[0.08, 1.5, 0.15]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff6b9d" />
      </mesh>
    </>
  );
}
