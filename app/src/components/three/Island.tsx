import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { PlaneGeometry } from 'three';

interface IslandProps {
  isNightMode: boolean;
}

export function Island({ isNightMode }: IslandProps) {
  const islandRef = useRef<Group>(null);
  const waterRef = useRef<Mesh>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      islandRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
    if (waterRef.current) {
      waterRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  // Generate terrain vertices for the island
  const terrainGeometry = useMemo(() => {
    const size = 8;
    const segments = 32;
    const geometry = new PlaneGeometry(size, size, segments, segments);
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const distance = Math.sqrt(x * x + y * y);
      
      // Create circular island shape with falloff
      let height = 0;
      if (distance < 3.5) {
        height = Math.max(0, 1.5 - distance * 0.3);
        // Add noise
        height += Math.sin(x * 2) * Math.cos(y * 2) * 0.1;
        height += Math.sin(x * 5 + y * 3) * 0.05;
      }
      
      positions[i + 2] = height;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <group ref={islandRef}>
      {/* Main island terrain */}
      <mesh 
        geometry={terrainGeometry} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={isNightMode ? '#1a3a2a' : '#4a7c59'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Grass layer on top */}
      <mesh 
        geometry={terrainGeometry} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.3, 0]}
        scale={[0.95, 0.95, 1]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={isNightMode ? '#2d5a3d' : '#7cb342'}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Water/Cloud base */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial 
          color={isNightMode ? '#1a1a3e' : '#87ceeb'}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <ringGeometry args={[5, 7, 64]} />
        <meshBasicMaterial 
          color={isNightMode ? '#ff6b9d' : '#4ecdc4'}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Decorative rocks */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2.5 + Math.random() * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.2 + Math.random() * 0.3;
        
        return (
          <mesh key={i} position={[x, 0.2, z]} castShadow>
            <dodecahedronGeometry args={[scale, 0]} />
            <meshStandardMaterial 
              color={isNightMode ? '#4a4a5a' : '#8b7355'}
              roughness={0.9}
            />
          </mesh>
        );
      })}

      {/* Small flowers/plants */}
      {[...Array(15)].map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const colors = ['#ff6b9d', '#ffe66d', '#ff8b94', '#a8e6cf'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <group key={`flower-${i}`} position={[x, 0.3, z]}>
            {/* Stem */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2]} />
              <meshStandardMaterial color="#4a7c59" />
            </mesh>
            {/* Flower */}
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial 
                color={color} 
                emissive={isNightMode ? color : '#000000'}
                emissiveIntensity={isNightMode ? 0.3 : 0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
