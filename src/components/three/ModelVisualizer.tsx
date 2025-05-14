import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { MotionConfig } from 'framer-motion';

interface ModelVisualizerProps {
  status: 'approved' | 'rejected' | 'pending';
}

const ModelVisualizer: React.FC<ModelVisualizerProps> = ({ status }) => {
  return (
    <MotionConfig transition={{ duration: 0.7 }}>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <spotLight 
          intensity={1} 
          angle={0.2} 
          penumbra={1} 
          position={[5, 15, 10]} 
          castShadow 
        />
        <Environment preset="city" />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <MouseModel status={status} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={1.5} far={4} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </MotionConfig>
  );
};

interface MouseModelProps {
  status: 'approved' | 'rejected' | 'pending';
}

const MouseModel: React.FC<MouseModelProps> = ({ status }) => {
  const group = useRef<THREE.Group>(null);
  
  const getStatusColor = () => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#3b82f6';
    }
  };
  
  const color = getStatusColor();
  
  return (
    <motion.group
      ref={group}
      initial={{ rotateY: -Math.PI / 4 }}
      animate={{ rotateY: Math.PI / 4 }}
      transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
    >
      {/* Simplified 3D mouse model */}
      <motion.mesh
        castShadow
        receiveShadow
        animate={{
          y: [0, 0.2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {/* Mouse body */}
        <motion.mesh position={[0, 0, 0]} scale={[1, 0.5, 2]}>
          <meshPhysicalMaterial
            color="#222222"
            roughness={0.5}
            metalness={0.3}
          />
          <sphereGeometry args={[1, 32, 32]} />
        </motion.mesh>

        {/* Left button */}
        <motion.mesh position={[-0.5, 0.525, -0.7]}>
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.1}
          />
          <boxGeometry args={[0.8, 0.05, 1]} />
        </motion.mesh>

        {/* Right button */}
        <motion.mesh position={[0.5, 0.525, -0.7]}>
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.1}
          />
          <boxGeometry args={[0.8, 0.05, 1]} />
        </motion.mesh>

        {/* Scroll wheel */}
        <motion.mesh position={[0, 0.55, -0.7]}>
          <meshPhysicalMaterial
            color="#333333"
            roughness={0.3}
            metalness={0.4}
          />
          <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        </motion.mesh>

        {/* Status light */}
        <motion.mesh 
          position={[0, 0.2, -1.7]}
          animate={{
            emissiveIntensity: [1, 2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <meshPhongMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
          <sphereGeometry args={[0.2, 16, 16]} />
        </motion.mesh>

        {/* USB Cable */}
        <motion.mesh position={[0, 0, 2]}>
          <meshStandardMaterial color="#333" />
          <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        </motion.mesh>
      </motion.mesh>
    </motion.group>
  );
};

export default ModelVisualizer;