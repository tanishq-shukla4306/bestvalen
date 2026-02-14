import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3 } from 'three';

interface LivingTreeProps {
  daysTogether: number;
  isNightMode: boolean;
  onBranchClick: (branchId: string) => void;
}

interface BranchData {
  id: string;
  start: Vector3;
  end: Vector3;
  angle: number;
  level: number;
  milestone?: string;
}

interface LeafData {
  id: string;
  position: Vector3;
  dayNumber: number;
  message: string;
}

export function LivingTree({ daysTogether, isNightMode, onBranchClick }: LivingTreeProps) {
  const treeRef = useRef<Group>(null);
  const [hoveredLeaf, setHoveredLeaf] = useState<string | null>(null);

  // Gentle sway animation
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  // Generate tree structure
  const { branches, leaves, flowers } = useMemo(() => {
    const branches: BranchData[] = [];
    const leaves: LeafData[] = [];
    const flowers: { position: Vector3; memory: string }[] = [];

    // Main trunk
    const trunkHeight = 2.5;
    const trunkSegments = 5;
    
    for (let i = 0; i < trunkSegments; i++) {
      const y = (i / trunkSegments) * trunkHeight;
      const nextY = ((i + 1) / trunkSegments) * trunkHeight;
      
      branches.push({
        id: `trunk-${i}`,
        start: new Vector3(0, y, 0),
        end: new Vector3(0, nextY, 0),
        angle: 0,
        level: 0,
      });
    }

    // Generate branches recursively
    const generateBranches = (
      start: Vector3,
      angle: number,
      length: number,
      level: number,
      maxLevel: number
    ) => {
      if (level > maxLevel || length < 0.3) return;

      const endX = start.x + Math.cos(angle) * length;
      const endY = start.y + Math.sin(angle) * length;
      const endZ = start.z + (Math.random() - 0.5) * 0.3;
      const end = new Vector3(endX, endY, endZ);

      const branchId = `branch-${level}-${branches.length}`;
      const milestone = level === 2 && branches.length % 3 === 0 
        ? `Milestone ${Math.floor(branches.length / 3) + 1}` 
        : undefined;

      branches.push({
        id: branchId,
        start,
        end,
        angle,
        level,
        milestone,
      });

      // Add leaves at branch ends
      if (level >= 2) {
        const numLeaves = Math.min(3, Math.floor(daysTogether / 100) + 1);
        for (let i = 0; i < numLeaves; i++) {
          const leafOffset = new Vector3(
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
          );
          leaves.push({
            id: `leaf-${branchId}-${i}`,
            position: end.clone().add(leafOffset),
            dayNumber: Math.floor(Math.random() * daysTogether) + 1,
            message: `Day ${Math.floor(Math.random() * daysTogether) + 1}: A moment of love`,
          });
        }

        // Add flowers for memories
        if (Math.random() > 0.7) {
          flowers.push({
            position: end.clone().add(new Vector3(0, 0.1, 0)),
            memory: `Memory ${flowers.length + 1}`,
          });
        }
      }

      // Sub-branches
      const numSubBranches = level < 2 ? 2 : 1;
      for (let i = 0; i < numSubBranches; i++) {
        const newAngle = angle + (Math.random() - 0.5) * 1.5;
        const newLength = length * 0.7;
        generateBranches(end, newAngle, newLength, level + 1, maxLevel);
      }
    };

    // Start branching from top of trunk
    generateBranches(new Vector3(0, trunkHeight, 0), -Math.PI / 2, 1.2, 1, 3);
    generateBranches(new Vector3(0, trunkHeight * 0.7, 0), -Math.PI / 2 - 0.5, 0.8, 1, 3);
    generateBranches(new Vector3(0, trunkHeight * 0.7, 0), -Math.PI / 2 + 0.5, 0.8, 1, 3);

    return { branches, leaves, flowers };
  }, [daysTogether]);

  // Fireflies
  const fireflies = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      id: `firefly-${i}`,
      position: new Vector3(
        (Math.random() - 0.5) * 4,
        1 + Math.random() * 3,
        (Math.random() - 0.5) * 4
      ),
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <group ref={treeRef} position={[0, 0, 0]}>
      {/* Trunk and branches */}
      {branches.map((branch) => (
        <group key={branch.id}>
          {/* Branch cylinder */}
          <mesh
            position={[
              (branch.start.x + branch.end.x) / 2,
              (branch.start.y + branch.end.y) / 2,
              (branch.start.z + branch.end.z) / 2,
            ]}
            rotation={[
              0,
              0,
              Math.atan2(branch.end.y - branch.start.y, branch.end.x - branch.start.x) - Math.PI / 2,
            ]}
            onClick={() => branch.milestone && onBranchClick(branch.id)}
          >
            <cylinderGeometry 
              args={[
                0.08 - branch.level * 0.02,
                0.1 - branch.level * 0.02,
                branch.start.distanceTo(branch.end),
                8
              ]} 
            />
            <meshStandardMaterial 
              color={isNightMode ? '#3d2817' : '#8b4513'}
              roughness={0.9}
            />
          </mesh>

          {/* Milestone marker */}
          {branch.milestone && (
            <mesh position={[branch.end.x, branch.end.y, branch.end.z]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial 
                color="#ffe66d"
                emissive={isNightMode ? '#ffe66d' : '#000000'}
                emissiveIntensity={isNightMode ? 0.5 : 0}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Leaves */}
      {leaves.map((leaf) => (
        <mesh
          key={leaf.id}
          position={[leaf.position.x, leaf.position.y, leaf.position.z]}
          onPointerOver={() => setHoveredLeaf(leaf.id)}
          onPointerOut={() => setHoveredLeaf(null)}
          scale={hoveredLeaf === leaf.id ? 1.3 : 1}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial 
            color="#7cb342"
            emissive={isNightMode ? '#4a7c59' : '#000000'}
            emissiveIntensity={isNightMode ? 0.3 : 0}
          />
        </mesh>
      ))}

      {/* Flowers */}
      {flowers.map((flower, i) => (
        <group key={`flower-${i}`} position={[flower.position.x, flower.position.y, flower.position.z]}>
          {/* Flower center */}
          <mesh>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#ff6b9d"
              emissive={isNightMode ? '#ff6b9d' : '#000000'}
              emissiveIntensity={isNightMode ? 0.4 : 0}
            />
          </mesh>
          {/* Petals */}
          {[...Array(5)].map((_, j) => {
            const angle = (j / 5) * Math.PI * 2;
            const px = Math.cos(angle) * 0.08;
            const pz = Math.sin(angle) * 0.08;
            return (
              <mesh key={j} position={[px, 0, pz]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshStandardMaterial 
                  color="#ff8b94"
                  emissive={isNightMode ? '#ff8b94' : '#000000'}
                  emissiveIntensity={isNightMode ? 0.3 : 0}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Fireflies */}
      {isNightMode && fireflies.map((firefly) => (
        <Firefly key={firefly.id} {...firefly} />
      ))}
    </group>
  );
}

function Firefly({ position, offset }: { position: Vector3; offset: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + offset;
      ref.current.position.x = position.x + Math.sin(t * 0.5) * 0.3;
      ref.current.position.y = position.y + Math.sin(t * 0.7) * 0.2;
      ref.current.position.z = position.z + Math.cos(t * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#ffe66d" />
      <pointLight color="#ffe66d" intensity={0.5} distance={2} />
    </mesh>
  );
}
