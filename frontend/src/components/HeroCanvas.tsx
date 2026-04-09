"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CubeGlobe from "./CubeGlobal";

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 18], fov: 35 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[15, 15, 15]} intensity={3} color="#ffffff" />
      <pointLight position={[-15, -5, 10]} intensity={2} color="#9b87f5" />
      <spotLight position={[0, -20, 0]} intensity={1.5} color="#d5c0ff" />
      <Suspense fallback={null}>
        <CubeGlobe />
      </Suspense>
    </Canvas>
  );
}