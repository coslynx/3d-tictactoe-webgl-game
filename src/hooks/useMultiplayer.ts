import { useState, useEffect, useCallback } from 'react';

interface GameState {
  board: (null | 'X' | 'O')[][];
  currentPlayer: 'X' | 'O';
  winner: null | 'X' | 'O';
  isTie: boolean;
}

export const useMultiplayer = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const websocketURL = process.env.REACT_APP_WEBSOCKET_URL || '';
  const reconnectInterval = useRef(1000); // Initial reconnect interval in milliseconds
  const maxReconnectInterval = 30000; // Maximum reconnect interval in milliseconds

  const connectWebSocket = useCallback(() => {
    if (!websocketURL) {
      console.error('WebSocket URL is not defined in the environment variables.');
      setErrorMessage('WebSocket URL is not defined. Please check your environment configuration.');
      return;
    }

    const ws = new WebSocket(websocketURL);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setErrorMessage('');
      reconnectInterval.current = 1000; // Reset reconnect interval on successful connection
    };

    ws.onmessage = (event) => {
      receiveMessage(event.data);
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.warn('WebSocket connection died');
        setIsConnected(false);
        setSocket(null);
        setErrorMessage('Connection to the server lost. Reconnecting...');
        reconnect();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setSocket(null);
      setErrorMessage('Failed to connect to the server. Reconnecting...');
      reconnect();
    };

    const reconnect = () => {
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        connectWebSocket();
        reconnectInterval.current = Math.min(reconnectInterval.current * 2, maxReconnectInterval);
      }, reconnectInterval.current);
    };

  }, [websocketURL, receiveMessage]);

  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      console.log('Disconnecting WebSocket');
      socket.close();
      setIsConnected(false);
      setSocket(null);
    }
  }, [socket]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  const sendMove = useCallback(
    (row: number, col: number) => {
      if (!isConnected || !socket) {
        console.warn('WebSocket is not connected. Cannot send move.');
        setErrorMessage('Not connected to the game server. Please try again later.');
        return;
      }

      if (typeof row !== 'number' || typeof col !== 'number' || row < 0 || row > 2 || col < 0 || col > 2) {
        console.error('Invalid move data:', { row, col });
        setErrorMessage('Invalid move data. Please check your input.');
        return;
      }

      try {
        const moveData = JSON.stringify({
          type: 'move',
          row: row,
          col: col,
        });
        socket.send(moveData);
      } catch (error) {
        console.error('Failed to send move:', error);
        setErrorMessage('Failed to send your move. Please try again.');
      }
    },
    [isConnected, socket]
  );

  const receiveMessage = useCallback((message: string) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);

      switch (data.type) {
        case 'game_state':
          if (
            typeof data.gameState?.board !== 'object' ||
            !Array.isArray(data.gameState.board) ||
            data.gameState.board.length !== 3 ||
            !data.gameState.board.every((row: any) => Array.isArray(row) && row.length === 3) ||
            (data.gameState.currentPlayer !== 'X' && data.gameState.currentPlayer !== 'O') ||
            (data.gameState.winner !== null && data.gameState.winner !== 'X' && data.gameState.winner !== 'O') ||
            typeof data.gameState.isTie !== 'boolean'
          ) {
            console.error('Invalid game_state message format:', data);
            setErrorMessage('Received invalid game state data from server.');
            return;
          }
          setGameState(data.gameState);
          break;
        case 'opponent_move':
          if (typeof data.row !== 'number' || typeof data.col !== 'number') {
            console.error('Invalid opponent_move message format:', data);
            setErrorMessage('Received invalid opponent move data from server.');
            return;
          }
          setGameState((prevGameState) => {
            if (!prevGameState) return prevGameState;
            const newBoard = prevGameState.board.map((rowArr, i) =>
              i === data.row ? rowArr.map((cell, j) => (j === data.col ? (prevGameState.currentPlayer === 'X' ? 'O' : 'X') : cell)) : rowArr
            );
            return { ...prevGameState, board: newBoard };
          });

          break;
        case 'error':
          if (typeof data.message !== 'string') {
            console.error('Invalid error message format:', data);
            setErrorMessage('Received invalid error message from server.');
            return;
          }
          setErrorMessage(data.message);
          break;
        case 'connection_confirmation':
          console.log('Connection confirmed by server.');
          setErrorMessage('');
          break;
        default:
          console.warn('Received unknown message type:', data.type);
          setErrorMessage(`Received unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
      setErrorMessage('Failed to process server message. Please check the console for details.');
    }
  }, []);

  return { isConnected, gameState, errorMessage, sendMove, connectWebSocket, disconnectWebSocket };
};