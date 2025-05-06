type Player = 'X' | 'O';
type BoardCell = null | Player;
type Board = BoardCell[][];

export const isValidMove = (board: Board, row: number, col: number): boolean => {
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    return false;
  }

  if (!board || !Array.isArray(board) || board.length !== 3) {
    return false;
  }

  if (!Array.isArray(board[row]) || board[row].length !== 3) {
    return false;
  }

  return board[row][col] === null;
};

export const checkWin = (board: Board): Player | null => {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
      return board[i][0];
    }
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i];
    }
  }

  if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
    return board[0][0];
  }

  if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
    return board[0][2];
  }

  return null;
};