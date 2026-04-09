"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function CubeGlobe() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { mouse } = useThree();

  const count = 250;
  const radius = 9;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const cubeData = useMemo(() => {
    const data = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      data.push({
        pos: new THREE.Vector3(x * radius, y * radius, z * radius),
        rotationSpeed: 0.1 + Math.random() * 0.5,
        baseScale: i % 3 === 0 ? 0.25 : 0.1,
      });
    }
    return data;
  }, [count, radius]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    cubeData.forEach((data, i) => {
      const { pos, baseScale, rotationSpeed } = data;
      dummy.position.copy(pos);
      dummy.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), time * 0.05 + mouse.x * 0.3);
      dummy.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), mouse.y * 0.3);
      dummy.rotation.set(time * rotationSpeed, time * 0.2, i);
      const s = baseScale + Math.sin(time + i) * 0.02;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#9b87f5"
        metalness={0.9}
        roughness={0.1}
        emissive="#ff00f8"
        emissiveIntensity={0.4}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}