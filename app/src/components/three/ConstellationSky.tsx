import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3, BufferGeometry, Line } from 'three';
import type { Star } from '@/types';

interface ConstellationSkyProps {
  stars: Star[];
  isNightMode: boolean;
  onStarClick: (starId: string) => void;
  secretUnlocked: boolean;
}

export function ConstellationSky({ 
  stars, 
  isNightMode, 
  onStarClick,
  secretUnlocked 
}: ConstellationSkyProps) {
  const groupRef = useRef<Group>(null);
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  // Slow rotation of the sky
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  // Convert 2D star positions to 3D sphere coordinates
  const starPositions = useMemo(() => {
    return stars.map(star => {
      // Map 2D canvas coordinates to 3D sphere surface
      const theta = (star.x / 800) * Math.PI * 2;
      const phi = (1 - star.y / 200) * Math.PI * 0.3 + Math.PI * 0.1;
      const radius = 15;
      
      return {
        ...star,
        position: new Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        ),
      };
    });
  }, [stars]);

  // Generate connection lines between stars
  const connections = useMemo(() => {
    const lines: { start: Vector3; end: Vector3 }[] = [];
    
    starPositions.forEach(star => {
      star.connectedTo.forEach(connectedId => {
        const connectedStar = starPositions.find(s => s.id === connectedId);
        if (connectedStar) {
          lines.push({
            start: star.position,
            end: connectedStar.position,
          });
        }
      });
    });
    
    return lines;
  }, [starPositions]);

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      {connections.map((connection, i) => (
        <StarConnection 
          key={i} 
          start={connection.start} 
          end={connection.end}
          isNightMode={isNightMode}
        />
      ))}

      {/* Stars */}
      {starPositions.map((star) => (
        <StarMesh
          key={star.id}
          star={star}
          isNightMode={isNightMode}
          isHovered={hoveredStar === star.id}
          onHover={() => setHoveredStar(star.id)}
          onLeave={() => setHoveredStar(null)}
          onClick={() => onStarClick(star.id)}
          secretUnlocked={secretUnlocked}
        />
      ))}

      {/* Background stars */}
      <BackgroundStars isNightMode={isNightMode} />
    </group>
  );
}

interface StarMeshProps {
  star: Star & { position: Vector3 };
  isNightMode: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  secretUnlocked: boolean;
}

function StarMesh({ 
  star, 
  isNightMode, 
  isHovered, 
  onHover, 
  onLeave, 
  onClick,
  secretUnlocked 
}: StarMeshProps) {
  const meshRef = useRef<Mesh>(null);

  // Twinkle animation
  useFrame((state) => {
    if (meshRef.current && star.type !== 'locked') {
      const twinkle = Math.sin(state.clock.elapsedTime * 3 + star.x) * 0.3 + 0.7;
      meshRef.current.scale.setScalar(star.size / 10 * twinkle * (isHovered ? 1.5 : 1));
    }
  });

  const getStarColor = () => {
    if (star.type === 'locked') return '#666666';
    if (star.type === 'secret' && !secretUnlocked) return '#333333';
    if (star.type === 'future') return '#4ecdc4';
    if (star.type === 'secret') return '#ff6b9d';
    return '#ffe66d';
  };

  const color = getStarColor();
  const isClickable = star.type !== 'locked' && (star.type !== 'secret' || secretUnlocked);

  return (
    <group position={[star.position.x, star.position.y, star.position.z]}>
      {/* Main star */}
      <mesh
        ref={meshRef}
        onClick={isClickable ? onClick : undefined}
        onPointerOver={isClickable ? onHover : undefined}
        onPointerOut={onLeave}
        scale={star.size / 10}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={isNightMode && star.type !== 'locked' ? color : '#000000'}
          emissiveIntensity={isNightMode ? 0.8 : 0}
        />
      </mesh>

      {/* Glow effect */}
      {isNightMode && star.type !== 'locked' && (
        <mesh scale={star.size / 5}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Locked indicator */}
      {star.type === 'locked' && (
        <mesh position={[0, -0.2, 0]} scale={0.5}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshBasicMaterial color="#444444" />
        </mesh>
      )}
    </group>
  );
}

function StarConnection({ 
  start, 
  end, 
  isNightMode 
}: { 
  start: Vector3; 
  end: Vector3; 
  isNightMode: boolean;
}) {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry().setFromPoints([start, end]);
    return geo;
  }, [start, end]);

  return (
    <primitive object={new Line(geometry, new THREE.LineBasicMaterial({
      color: isNightMode ? '#4ecdc4' : '#87ceeb',
      transparent: true,
      opacity: isNightMode ? 0.4 : 0.2,
    }))} />
  );
}

function BackgroundStars({ isNightMode }: { isNightMode: boolean }) {
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      position: new Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 + 10,
        (Math.random() - 0.5) * 40
      ),
      size: Math.random() * 0.05 + 0.02,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <BackgroundStar 
          key={star.id} 
          {...star} 
          isNightMode={isNightMode}
        />
      ))}
    </>
  );
}

function BackgroundStar({ 
  position, 
  size, 
  twinkleOffset, 
  isNightMode 
}: { 
  position: Vector3; 
  size: number; 
  twinkleOffset: number;
  isNightMode: boolean;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const twinkle = Math.sin(state.clock.elapsedTime * 2 + twinkleOffset) * 0.5 + 0.5;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = isNightMode ? twinkle * 0.8 : 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial 
        color="#ffffff"
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// Import THREE for LineBasicMaterial
import * as THREE from 'three';
