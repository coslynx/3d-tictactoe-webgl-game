import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CellProps {
  row: number;
  col: number;
  value: null | 'X' | 'O';
  onClick: () => void;
  position: [number, number, number];
  size: number;
  isWinningCell?: boolean;
}

const Cell: React.FC<CellProps> = React.memo(({
  row,
  col,
  value,
  onClick,
  position,
  size,
  isWinningCell = false,
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.material.color.lerp(
        new THREE.Color(
          isWinningCell
            ? 0x98c379
            : mesh.current.userData.isHovered
              ? 0x61dafb
              : 0xabb2bf
        ),
        0.1
      );
    }
  });

  const handlePointerOver = () => {
    if (mesh.current && !value) {
      mesh.current.userData.isHovered = true;
    }
  };

  const handlePointerOut = () => {
    if (mesh.current) {
      mesh.current.userData.isHovered = false;
    }
  };

  const handleClick = () => {
    try {
      if (!value) {
        onClick();
      }
    } catch (error) {
      console.error(`Error handling click for cell (${row}, ${col}):`, error);
    }
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      userData={{ isHovered: false }}
    >
      <boxGeometry args={[size, 0.1, size]} />
      <meshStandardMaterial color={0xabb2bf} />
    </mesh>
  );
});

export default Cell;