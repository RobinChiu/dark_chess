import React, { useState, useEffect } from 'react';
import './App.css';
import { initializePieces, createBoard, isValidMove, checkWinner } from './gameLogic';

const ChessBoard = () => {
  const [board, setBoard] = useState(Array(8).fill(Array(4).fill(null)));
  const [pieces, setPieces] = useState([]);
  const [flippedPieces, setFlippedPieces] = useState(new Set());
  const [currentPlayer, setCurrentPlayer] = useState('?');
  const [gameStatus, setGameStatus] = useState('ongoing');
  // const [validMoves, setValidMoves] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ red: [], black: [] });

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const allPieces = initializePieces();
    const newBoard = createBoard(allPieces);
    setBoard(newBoard);
    setPieces(allPieces);
  };

const flipPiece = (row, col) => {
  if (gameStatus !== 'ongoing') return;

  const newFlippedPieces = new Set(flippedPieces);
  if (newFlippedPieces.has(`${row},${col}`)) {
    newFlippedPieces.delete(`${row},${col}`);
  } else {
    newFlippedPieces.add(`${row},${col}`);
  }
  setFlippedPieces(newFlippedPieces);
  checkForWinner();
};

const checkForWinner = () => {
  const winner = checkWinner(board);
  if (winner === 'black') {
    setGameStatus('black wins');
  } else if (winner === 'red') {
    setGameStatus('red wins');
  }
};

const validateMove = (startRow, startCol, endRow, endCol) => {
  return isValidMove(board, startRow, startCol, endRow, endCol);
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
  if (!validateMove(startRow, startCol, endRow, endCol)) return;

  const newBoard = [...board];
  const piece = newBoard[startRow][startCol];
  newBoard[startRow][startCol] = null;
  capturePiece(endRow, endCol);
  newBoard[endRow][endCol] = piece;

  setBoard(newBoard);
  setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
  checkForWinner();
};

const [selectedPiece, setSelectedPiece] = useState(null);

const handlePieceClick = (row, col) => {
  if (gameStatus !== 'ongoing') return;
  
  // flip the piece
  if (!flippedPieces.has(`${row},${col}`)) {
    flipPiece(row, col)
    if (currentPlayer==='?')
      setCurrentPlayer(board[row][col].player === 'red' ? 'black' : 'red')
    else
      setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
    setSelectedPiece(null);
    return
  }

  // selec and move the piece
  if (selectedPiece) {
    // Attempt to move the selected piece to the clicked position
    if (validateMove(selectedPiece.row, selectedPiece.col, row, col)) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
    }
    setSelectedPiece(null);
  } else {
    const piece = board[row][col];
    if (!piece || piece.player !== currentPlayer) return;
    // Select the piece for movement
    setSelectedPiece({ row, col });
  }
};

const renderPiece = (row, col) => {
  const piece = board[row][col];
  if (!piece) return (
    <div
      className={`empty`}
      onClick={() => handlePieceClick(row, col)}
    >
    </div>
  )

  const isFlipped = flippedPieces.has(`${row},${col}`);
  let player = 'mask'
  if (isFlipped) {
    player = piece.player
  } 
  
  let select = ""
  if(selectedPiece && row===selectedPiece.row && col===selectedPiece.col ){
    select = "select"
  }

  return (
    <div
      className={`piece ${player} ${select}`}
      onClick={() => handlePieceClick(row, col)}
    >
      {isFlipped ? piece.type : ''}
    </div>
  );
};

  let player = "?"
  if(currentPlayer==="black")
    player = '⚫'
  else if(currentPlayer==="red")
    player = '🔴'

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
        <p>Current Player: {player}</p>
        <p>Game Status: {gameStatus}</p>
        <p>Captured Pieces: Red  : {capturedPieces.red.join(', ')}</p>
        <p>Captured Pieces: Black: {capturedPieces.black.join(', ')}</p>
      </div>
    </div>
  );
};

export default ChessBoard;
