import React, { useState, useEffect } from 'react';
import './App.css';

const ChessBoard = () => {
  const [board, setBoard] = useState(Array(8).fill(Array(4).fill(null)));
  const [pieces, setPieces] = useState([]);
  const [flippedPieces, setFlippedPieces] = useState(new Set());
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [gameStatus, setGameStatus] = useState('ongoing');
  const [validMoves, setValidMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ red: [], black: [] });

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const pieceTypes = ['將', '仕', '相', '車', '馬', '砲', '兵'];
    const blackPieceCounts = { '將': 1, '士': 2, '象': 2, '車': 2, '馬': 2, '包': 2, '卒': 5 };
    const redPieceCounts = { '帥': 1, '仕': 2, '相': 2, '俥': 2, '傌': 2, '炮': 2, '兵': 5 };
    const allPieces = []; 

    for (const [type, count] of Object.entries(blackPieceCounts)) {
      for (let i = 0; i < count; i++) {
        allPieces.push({ type, player: 'black' });
      }
    }

    for (const [type, count] of Object.entries(redPieceCounts)) {
      for (let i = 0; i < count; i++) {
        allPieces.push({ type, player: 'red' });
      }
    }

    // Shuffle pieces
    for (let i = allPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPieces[i], allPieces[j]] = [allPieces[j], allPieces[i]];
    }

    const newBoard = Array(8).fill(null).map(() => Array(4).fill(null));
    let pieceIndex = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        if (newBoard[row][col] === null && pieceIndex < allPieces.length) {
          newBoard[row][col] = allPieces[pieceIndex];
          pieceIndex++;
        }
      }
    }

    setBoard(newBoard);
    setPieces(allPieces);
  };

const flipPiece = (row, col) => {
  if (gameStatus !== 'ongoing') return;

  // const piece = board[row][col];
  // if (!piece || piece.player !== currentPlayer) return;

  const newFlippedPieces = new Set(flippedPieces);
  if (newFlippedPieces.has(`${row},${col}`)) {
    // newFlippedPieces.delete(`${row},${col}`);
  } else {
    newFlippedPieces.add(`${row},${col}`);
  }
  setFlippedPieces(newFlippedPieces);
  checkForWinner();
};

const checkForWinner = () => {
  let redFound = false;
  let blackFound = false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 4; col++) {
      const piece = board[row][col];
      if (piece) {
        if (piece.player === 'black') {
          blackFound = true;
        } else if (piece.player === 'red') {
          redFound = true;
        }
      }
    }
  }

  if (!redFound) {
    setGameStatus('black wins');
  } else if (!blackFound) {
    setGameStatus('red wins');
  }
};

const isValidMove = (startRow, startCol, endRow, endCol) => {
  const piece = board[startRow][startCol];
  if (!piece) return false;

  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;

  switch (piece.type) {
    case '將':
    case '帥':
      // Generals can only move within their respective palaces
      if (piece.player === 'red') {
        return (endRow >= 0 && endRow <= 2) && (endCol >= 1 && endCol <= 3) && (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1);
      } else {
        return (endRow >= 7 && endRow <= 9) && (endCol >= 1 && endCol <= 3) && (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1);
      }
    case '仕':
      // Advisors can only move within their respective palaces
      if (piece.player === 'red') {
        return (endRow >= 0 && endRow <= 2) && (endCol >= 1 && endCol <= 3) && (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1);
      } else {
        return (endRow >= 7 && endRow <= 9) && (endCol >= 1 && endCol <= 3) && (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1);
      }
    case '相':
      // Elephants cannot jump over pieces
      if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return false;
      const elephantRow = startRow + rowDiff / 2;
      const elephantCol = startCol + colDiff / 2;
      return !board[elephantRow][elephantCol];
    case '車':
      // Rooks can move any number of squares along a rank or file
      if (rowDiff !== 0 && colDiff !== 0) return false;
      const stepRow = rowDiff !== 0 ? (rowDiff > 0 ? 1 : -1) : 0;
      const stepCol = colDiff !== 0 ? (colDiff > 0 ? 1 : -1) : 0;
      for (let i = 1; i < Math.abs(rowDiff) + Math.abs(colDiff); i++) {
        if (board[startRow + stepRow * i][startCol + stepCol * i]) return false;
      }
      return true;
    case '馬':
      // Knights move in an L-shape
      if (!((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2))) return false;
      const knightRow = startRow + (rowDiff > 0 ? (rowDiff === 2 ? 1 : -1) : 0);
      const knightCol = startCol + (colDiff > 0 ? (colDiff === 2 ? 1 : -1) : 0);
      return !board[knightRow][knightCol];
    case '砲':
      // Cannons can move any number of squares along a rank or file, but must jump over exactly one piece to capture
      if (rowDiff !== 0 && colDiff !== 0) return false;
      const stepRowCannon = rowDiff !== 0 ? (rowDiff > 0 ? 1 : -1) : 0;
      const stepColCannon = colDiff !== 0 ? (colDiff > 0 ? 1 : -1) : 0;
      let jumpCount = 0;
      for (let i = 1; i < Math.abs(rowDiff) + Math.abs(colDiff); i++) {
        if (board[startRow + stepRowCannon * i][startCol + stepColCannon * i]) jumpCount++;
      }
      if (jumpCount === 1) {
        // Check if the end position has an opponent's piece
        const endPiece = board[endRow][endCol];
        return endPiece && endPiece.player !== piece.player;
      }
      return jumpCount === 0;
    case '兵':
      // Pawns can only move forward and capture diagonally after crossing the river
      if (piece.player === 'red') {
        if (endRow < 4) {
          return rowDiff === 1 && colDiff === 0;
        } else {
          return (rowDiff === 1 && colDiff === 0) || (rowDiff === 1 && Math.abs(colDiff) === 1);
        }
      } else {
        if (endRow >= 4) {
          return rowDiff === -1 && colDiff === 0;
        } else {
          return (rowDiff === -1 && colDiff === 0) || (rowDiff === -1 && Math.abs(colDiff) === 1);
        }
      }
    default:
      return false;
  }
};

const capturePiece = (row, col) => {
  const piece = board[row][col];
  if (!piece) return;

  const newCapturedPieces = { ...capturedPieces };
  newCapturedPieces[piece.player].push(piece.type);
  setCapturedPieces(newCapturedPieces);

  const newBoard = [...board];
  newBoard[row][col] = null;
  setBoard(newBoard);
};

const movePiece = (startRow, startCol, endRow, endCol) => {
  if (!isValidMove(startRow, startCol, endRow, endCol)) return;

  const newBoard = [...board];
  const piece = newBoard[startRow][startCol];
  newBoard[startRow][startCol] = null;
  newBoard[endRow][endCol] = piece;

  if (newBoard[endRow][endCol].type === '將' || newBoard[endRow][endCol].type === '帥') {
    capturePiece(endRow, endCol);
  }

  setBoard(newBoard);
  setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
  checkForWinner();
};

const [selectedPiece, setSelectedPiece] = useState(null);

const handlePieceClick = (row, col) => {
  if (gameStatus !== 'ongoing') return;
  
  if (!flippedPieces.has(`${row},${col}`)) {
    flipPiece(row, col)
    setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
    return
  }
  
  const piece = board[row][col];
  if (!piece || piece.player !== currentPlayer) return;

  if (selectedPiece) {
    // Attempt to move the selected piece to the clicked position
    if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
    }
    setSelectedPiece(null);
  } else {
    // Select the piece for movement
    setSelectedPiece({ row, col });
  }
};

const renderPiece = (row, col) => {
  const piece = board[row][col];
  if (!piece) return null;
  const isFlipped = flippedPieces.has(`${row},${col}`);
  let player = 'mark'
  if (isFlipped) {
    player = piece.player
  } 
  return (
    <div
      className={`piece ${player}`}
      onClick={() => handlePieceClick(row, col)}
    >
      {isFlipped ? piece.type : ''}
    </div>
  );
};

  return (
    <div className="chess-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((_, colIndex) => (
            <div key={colIndex} className="board-cell">
              {renderPiece(rowIndex, colIndex)}
            </div>
          ))}
        </div>
      ))}
      <div className="game-info">
        <p>Current Player: {currentPlayer}</p>
        <p>Game Status: {gameStatus}</p>
        <p>Captured Pieces: Red: {capturedPieces.red.join(', ')} | Black: {capturedPieces.black.join(', ')}</p>
      </div>
    </div>
  );
};

export default ChessBoard;
