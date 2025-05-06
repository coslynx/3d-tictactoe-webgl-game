import { useState, useCallback } from 'react';
import { checkWin, isValidMove } from '@/src/utils/gameLogic';

type Player = 'X' | 'O';
type BoardCell = null | Player;
type Board = BoardCell[][];

export const useGame = () => {
  const X_PLAYER: Player = 'X';
  const O_PLAYER: Player = 'O';
  const initialBoard: Board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(X_PLAYER);
  const [winner, setWinner] = useState<null | Player>(null);
  const [isTie, setIsTie] = useState<boolean>(false);

  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setCurrentPlayer(X_PLAYER);
    setWinner(null);
    setIsTie(false);
  }, [initialBoard, X_PLAYER]);

  const makeMove = useCallback(
    (row: number, col: number) => {
      try {
        if (winner || isTie) {
          console.warn('Game is already over.');
          return;
        }

        if (row < 0 || row > 2 || col < 0 || col > 2) {
          console.error('Invalid row or col values.');
          return;
        }

        if (!isValidMove(board, row, col)) {
          console.warn('Invalid move.');
          return;
        }

        setBoard((prevBoard) => {
          const newBoard = prevBoard.map((rowArr, i) =>
            i === row ? rowArr.map((cell, j) => (j === col ? currentPlayer : cell)) : rowArr
          );

          const newWinner = checkWin(newBoard);
          if (newWinner) {
            setWinner(newWinner);
          } else if (newBoard.every(row => row.every(cell => cell !== null))) {
            setIsTie(true);
          } else {
            setCurrentPlayer(prevPlayer => (prevPlayer === X_PLAYER ? O_PLAYER : X_PLAYER));
          }

          return newBoard;
        });
      } catch (error) {
        console.error('Error during makeMove:', error);
        resetGame();
      }
    },
    [board, currentPlayer, winner, isTie, resetGame, X_PLAYER, O_PLAYER]
  );

  return { board, currentPlayer, winner, isTie, makeMove, resetGame };
};