import React from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { GridHelper } from '@react-three/drei';
import Cell from './Cell';
import Piece from './Piece';
import { useGame } from '../hooks/useGame';

interface BoardProps {
  boardData: (null | 'X' | 'O')[][];
  onClick: (row: number, col: number) => void;
  winningLine?: [number, number][];
}

const Board: React.FC<BoardProps> = React.memo(({ boardData, onClick, winningLine }) => {
  const { scene } = useThree();
  const gridSize = 3;
  const cellSize = 1;

  const boardColor = new THREE.Color(0xabb2bf);

  useEffect(() => {
    // Add a grid helper to the scene
    const gridHelper = new THREE.GridHelper(gridSize * cellSize, gridSize, boardColor, boardColor);
    scene.add(gridHelper);

    // Cleanup function to remove the grid helper when the component unmounts
    return () => {
      scene.remove(gridHelper);
    };
  }, [scene, gridSize, cellSize, boardColor]);

  const handleCellClick = (row: number, col: number) => {
    try {
      onClick(row, col);
    } catch (error) {
      console.error(`Error handling click for cell (${row}, ${col}):`, error);
    }
  };

  return (
    <group>
      {boardData.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const position = [colIndex * cellSize - cellSize, 0, rowIndex * cellSize - cellSize];
          const isWinningCell = winningLine?.some(([r, c]) => r === rowIndex && c === colIndex) ?? false;

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              value={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              position={position}
              size={cellSize}
              isWinningCell={isWinningCell}
            >
              {cell && <Piece type={cell} />}
            </Cell>
          );
        })
      )}
    </group>
  );
});

export default Board;