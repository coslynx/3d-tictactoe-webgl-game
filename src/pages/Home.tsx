import React, { useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Board from '@/src/components/Board';
import { useGame } from '@/src/hooks/useGame';
import { useMultiplayer } from '@/src/hooks/useMultiplayer';

interface HomeProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Home: React.FC<HomeProps> = ({ toggleTheme, theme }) => {
  const { board, makeMove, winner, isTie, resetGame } = useGame();
  const { isConnected, gameState, errorMessage, sendMove, connectWebSocket, disconnectWebSocket } = useMultiplayer();

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (isConnected) {
        sendMove(row, col);
      } else {
        makeMove(row, col);
      }
    },
    [isConnected, makeMove, sendMove]
  );

  useEffect(() => {
    if (gameState?.board) {
      console.log('Received game state:', gameState);
    }
  }, [gameState]);

  const currentBoard = gameState?.board || board;
  const currentWinner = gameState?.winner || winner;
  const currentIsTie = gameState?.isTie || isTie;

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-4">3D Tic-Tac-Toe</h1>

      <Canvas
        camera={{ position: [0, 5, 5], fov: 75, near: 0.1, far: 1000 }}
        style={{ width: '80%', height: '500px', background: '#282c34' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 3]} intensity={0.7} />
        <Board boardData={currentBoard} onClick={handleClick} winningLine={null} />
        <OrbitControls />
      </Canvas>

      <div className="mt-4 text-center">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!isConnected && <p className="text-yellow-500">Connecting to server...</p>}
        {currentWinner && <p className="text-accent">Winner: {currentWinner}</p>}
        {currentIsTie && <p className="text-board">It's a tie!</p>}

        <button
          className="bg-secondary text-primary font-body px-4 py-2 rounded hover:bg-accent transition-colors duration-300"
          onClick={resetGame}
        >
          Reset Game
        </button>
        <button
          className="bg-accent text-primary font-body px-4 py-2 rounded hover:bg-secondary transition-colors duration-300 ml-4"
          onClick={toggleTheme}
        >
          Toggle Theme ({theme})
        </button>
        <button
            className="bg-board text-primary font-body px-4 py-2 rounded hover:bg-secondary transition-colors duration-300 ml-4"
            onClick={isConnected ? disconnectWebSocket : connectWebSocket}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
      </div>
    </motion.div>
  );
};

export default Home;