import React, { useState, useEffect } from 'react';
import './App.css';

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

  const pieceNumber = {
    '將': 1, '士': 2, '象': 3, '車': 4, '馬': 5, '包': 6, '卒': 7, 
    '帥': 1, '仕': 2, '相': 3, '俥': 4, '傌': 5, '炮': 6, '兵': 7 
  }

  const initializeBoard = () => {
    // const pieceTypes = ['將', '仕', '相', '車', '馬', '砲', '兵'];
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

    const newBoard = Array(4).fill(null).map(() => Array(8).fill(null));
    let pieceIndex = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
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
  let redFound = false;
  let blackFound = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
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
  const piece1 = board[startRow][startCol];
  const piece2 = board[endRow][endCol]
  if (!piece1) return false;

  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;

  // move up, down, left, right
  if ((Math.abs(rowDiff) === 1 && colDiff===0) || (Math.abs(colDiff) === 1 && rowDiff===0)) {
    // piece2 is empty
    if(!piece2) {
      return true;
    // piece1 and piece2 same player
    } else if (piece1.player===piece2.player) {
  return false;
    // compare the piece1 and piece2 number
    } else  {
      let number1 = pieceNumber[piece1.type]
      let number2 = pieceNumber[piece2.type]
      if(number1===7 && number2===1) {
      return true;
    }
      if(number1===1 && number2===7) {
        return false;
      }
      if((number1 <= number2)) {
        return true;
      }
    }
  }
  // check 包, 炮
  if(piece1.type==='包' || piece1.type==='炮'){
    // check piece2 and player
    if(!piece2 || piece1.player===piece2.player)
      return false
    // check the piece count between them
    if(rowDiff===0) {
      let count = 0
      let start = startCol
      let end = endCol
      if(startCol>endCol){
        start = endCol
        end = startCol
      }
      for(let i=start+1; i<end; i++) {
        if(board[startRow][i]) 
        count++;
      }
      if(count===1)
        return true;
      }
    if(colDiff===0) {
      let count = 0
      let start = startRow
      let end = endRow
      if(startRow>endRow){
        start = endRow
        end = startRow
      }
      for(let i=start+1; i<end; i++) {
        if(board[i][startCol]) 
          count++;
      }
      if(count===1)
        return true;
      }
    }

  return false
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
    if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
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
        <p>Captured Pieces: Red  : {capturedPieces.red.join(', ')}</p>
        <p>Captured Pieces: Black: {capturedPieces.black.join(', ')}</p>
      </div>
    </div>
  );
};

export default ChessBoard;
