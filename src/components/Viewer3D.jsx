import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Plane, TransformControls, useTexture } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function DraggableObject({ imageUrl, initialPosition = [0, 1, -1] }) {
  const texture = useTexture(imageUrl);
  return (
    <TransformControls mode="translate">
      <Plane args={[2, 2]} position={initialPosition}>
        <meshStandardMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
      </Plane>
    </TransformControls>
  );
}

function Room({ wallColor, floorColor }) {
  return (
    <>
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color={floorColor || "#C8B89A"} />
      </Plane>
      <Plane args={[10, 5]} position={[0, 2.5, -5]}>
        <meshStandardMaterial color={wallColor || "#F5F0EB"} />
      </Plane>
      <Plane args={[10, 5]} rotation={[0, Math.PI / 2, 0]} position={[-5, 2.5, 0]}>
        <meshStandardMaterial color={wallColor || "#F5F0EB"} />
      </Plane>
      {/* Sofa placeholder */}
      <Box args={[3, 0.8, 1.2]} position={[0, 0.4, -3]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      {/* Coffee table */}
      <Box args={[1.5, 0.1, 0.8]} position={[0, 0.5, -1.5]}>
        <meshStandardMaterial color="#5C4033" />
      </Box>
    </>
  );
}

export default function Viewer3D({ wallColor, floorColor, uploadedObjects = [] }) {
  return (
    <div style={{ height: 400, borderRadius: 12, overflow: "hidden", background: "#1a1a2e" }}>
      <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Room wallColor={wallColor} floorColor={floorColor} />
        
        {uploadedObjects.map((obj, index) => (
          <Suspense key={index} fallback={null}>
            <DraggableObject imageUrl={obj} initialPosition={[index * 0.5, 1, -1 + index * 0.2]} />
          </Suspense>
        ))}
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}