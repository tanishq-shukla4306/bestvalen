import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Vector3, Color } from 'three';
import gsap from 'gsap';
import { Island } from './Island';
import { LivingTree } from './LivingTree';
import { MemoryBuildings } from './MemoryBuildings';
import { ConstellationSky } from './ConstellationSky';
import type { Memory, Star } from '@/types';

interface Scene3DProps {
  currentScene: string;
  memories: Memory[];
  stars: Star[];
  daysTogether: number;
  isNightMode: boolean;
  secretUnlocked: boolean;
  selectedBuilding: string | null;
  onBuildingClick: (memoryId: string) => void;
  onStarClick: (starId: string) => void;
  onBranchClick: (branchId: string) => void;
}

function CameraController({ 
  currentScene, 
  selectedBuilding,
  memories 
}: { 
  currentScene: string; 
  selectedBuilding: string | null;
  memories: Memory[];
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    let targetPosition: Vector3;
    let lookAtTarget: Vector3;

    switch (currentScene) {
      case 'opening':
        targetPosition = new Vector3(0, 15, 20);
        lookAtTarget = new Vector3(0, 0, 0);
        break;
      case 'island':
        targetPosition = new Vector3(8, 8, 12);
        lookAtTarget = new Vector3(0, 0, 0);
        break;
      case 'tree':
        targetPosition = new Vector3(3, 4, 5);
        lookAtTarget = new Vector3(0, 2, 0);
        break;
      case 'building':
        if (selectedBuilding) {
          const memory = memories.find(m => m.id === selectedBuilding);
          if (memory) {
            targetPosition = new Vector3(
              memory.position.x + 3,
              3,
              memory.position.z + 3
            );
            lookAtTarget = new Vector3(
              memory.position.x,
              1,
              memory.position.z
            );
          } else {
            targetPosition = new Vector3(5, 5, 8);
            lookAtTarget = new Vector3(0, 0, 0);
          }
        } else {
          targetPosition = new Vector3(5, 5, 8);
          lookAtTarget = new Vector3(0, 0, 0);
        }
        break;
      case 'sky':
        targetPosition = new Vector3(0, 12, 5);
        lookAtTarget = new Vector3(0, 15, 0);
        break;
      case 'final':
        targetPosition = new Vector3(0, 20, 15);
        lookAtTarget = new Vector3(0, 0, 0);
        break;
      default:
        targetPosition = new Vector3(8, 8, 12);
        lookAtTarget = new Vector3(0, 0, 0);
    }

    // Animate camera position
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: 'power2.inOut',
    });

    // Animate camera lookAt
    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        x: lookAtTarget.x,
        y: lookAtTarget.y,
        z: lookAtTarget.z,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [currentScene, selectedBuilding, memories, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={30}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

function SceneContent({
  currentScene,
  memories,
  stars,
  daysTogether,
  isNightMode,
  secretUnlocked,
  selectedBuilding,
  onBuildingClick,
  onStarClick,
  onBranchClick,
}: Scene3DProps) {
  const { scene } = useThree();

  // Set background color based on night mode
  useEffect(() => {
    scene.background = isNightMode 
      ? new Color('#0a0a1a')
      : new Color('#1a1a3e');
  }, [isNightMode, scene]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={isNightMode ? 0.3 : 0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={isNightMode ? 0.5 : 1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Point lights for night mode atmosphere */}
      {isNightMode && (
        <>
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff6b9d" />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4ecdc4" />
          <pointLight position={[0, 10, 0]} intensity={0.3} color="#ffe66d" />
        </>
      )}

      {/* Stars background */}
      {isNightMode && (
        <Stars
          radius={50}
          depth={50}
          count={1000}
          factor={4}
          saturation={0.5}
          fade
        />
      )}

      {/* Main scene objects */}
      <group>
        {/* Floating Island */}
        <Island isNightMode={isNightMode} />

        {/* Living Tree at center */}
        <LivingTree
          daysTogether={daysTogether}
          isNightMode={isNightMode}
          onBranchClick={onBranchClick}
        />

        {/* Memory Buildings */}
        <MemoryBuildings
          memories={memories}
          isNightMode={isNightMode}
          onBuildingClick={onBuildingClick}
          selectedBuilding={selectedBuilding}
        />

        {/* Constellation Sky */}
        <ConstellationSky
          stars={stars}
          isNightMode={isNightMode}
          onStarClick={onStarClick}
          secretUnlocked={secretUnlocked}
        />
      </group>

      {/* Camera controller */}
      <CameraController 
        currentScene={currentScene} 
        selectedBuilding={selectedBuilding}
        memories={memories}
      />
    </>
  );
}

export function Scene3D(props: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 15, 20], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={60} />
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
