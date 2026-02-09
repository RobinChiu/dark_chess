// Game logic functions for Dark Chess

export const pieceNumber = {
  '將': 1, '士': 2, '象': 3, '車': 4, '馬': 5, '包': 6, '卒': 7,
  '帥': 1, '仕': 2, '相': 3, '俥': 4, '傌': 5, '炮': 6, '兵': 7
};

export const blackPieceCounts = {
  '將': 1, '士': 2, '象': 2, '車': 2, '馬': 2, '包': 2, '卒': 5
};

export const redPieceCounts = {
  '帥': 1, '仕': 2, '相': 2, '俥': 2, '傌': 2, '炮': 2, '兵': 5
};

/**
 * Initialize and shuffle all pieces for the board
 * @returns {Array} Array of piece objects with {type, player}
 */
export const initializePieces = () => {
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

  return allPieces;
};

/**
 * Create initial board with pieces
 * @param {Array} pieces - Array of piece objects
 * @returns {Array} 4x8 board array
 */
export const createBoard = (pieces) => {
  const newBoard = Array(4).fill(null).map(() => Array(8).fill(null));
  let pieceIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      if (newBoard[row][col] === null && pieceIndex < pieces.length) {
        newBoard[row][col] = pieces[pieceIndex];
        pieceIndex++;
      }
    }
  }

  return newBoard;
};

/**
 * Check if a move is adjacent (one step in any direction)
 * @param {number} startRow
 * @param {number} startCol
 * @param {number} endRow
 * @param {number} endCol
 * @returns {boolean}
 */
export const isAdjacentMove = (startRow, startCol, endRow, endCol) => {
  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;
  return (Math.abs(rowDiff) === 1 && colDiff === 0) ||
         (Math.abs(colDiff) === 1 && rowDiff === 0);
};

/**
 * Check if piece1 can capture piece2 based on rank
 * @param {string} piece1Type
 * @param {string} piece2Type
 * @returns {boolean}
 */
export const canCapture = (piece1Type, piece2Type) => {
  const number1 = pieceNumber[piece1Type];
  const number2 = pieceNumber[piece2Type];

  // Special case: 兵/卒 (7) can capture 將/帥 (1)
  if (number1 === 7 && number2 === 1) {
    return true;
  }

  // Special case: 將/帥 (1) cannot be captured by 兵/卒 (7)
  if (number1 === 1 && number2 === 7) {
    return false;
  }

  // Normal case: lower or equal number can capture
  return number1 <= number2;
};

/**
 * Count pieces between two positions in a line
 * @param {Array} board
 * @param {number} startRow
 * @param {number} startCol
 * @param {number} endRow
 * @param {number} endCol
 * @returns {number} Count of pieces between positions
 */
export const countPiecesBetween = (board, startRow, startCol, endRow, endCol) => {
  let count = 0;

  // Horizontal move
  if (startRow === endRow) {
    const start = Math.min(startCol, endCol);
    const end = Math.max(startCol, endCol);
    for (let i = start + 1; i < end; i++) {
      if (board[startRow][i]) {
        count++;
      }
    }
  }

  // Vertical move
  if (startCol === endCol) {
    const start = Math.min(startRow, endRow);
    const end = Math.max(startRow, endRow);
    for (let i = start + 1; i < end; i++) {
      if (board[i][startCol]) {
        count++;
      }
    }
  }

  return count;
};

/**
 * Check if a cannon/pao move is valid (must jump over exactly one piece)
 * @param {Array} board
 * @param {Object} piece1
 * @param {Object} piece2
 * @param {number} startRow
 * @param {number} startCol
 * @param {number} endRow
 * @param {number} endCol
 * @returns {boolean}
 */
export const isValidCannonMove = (board, piece1, piece2, startRow, startCol, endRow, endCol) => {
  // Cannon must capture an enemy piece
  if (!piece2 || piece1.player === piece2.player) {
    return false;
  }

  // Must be in a line (horizontal or vertical)
  if (startRow !== endRow && startCol !== endCol) {
    return false;
  }

  // Must have exactly one piece in between
  const piecesInBetween = countPiecesBetween(board, startRow, startCol, endRow, endCol);
  return piecesInBetween === 1;
};

/**
 * Validate if a move is legal
 * @param {Array} board
 * @param {number} startRow
 * @param {number} startCol
 * @param {number} endRow
 * @param {number} endCol
 * @returns {boolean}
 */
export const isValidMove = (board, startRow, startCol, endRow, endCol) => {
  const piece1 = board[startRow][startCol];
  const piece2 = board[endRow][endCol];

  if (!piece1) return false;

  // Cannon/Pao special move
  if (piece1.type === '包' || piece1.type === '炮') {
    return isValidCannonMove(board, piece1, piece2, startRow, startCol, endRow, endCol);
  }

  // Regular move - must be adjacent
  if (!isAdjacentMove(startRow, startCol, endRow, endCol)) {
    return false;
  }

  // Move to empty space
  if (!piece2) {
    return true;
  }

  // Cannot capture same player's piece
  if (piece1.player === piece2.player) {
    return false;
  }

  // Check if can capture based on rank
  return canCapture(piece1.type, piece2.type);
};

/**
 * Check if a player has won
 * @param {Array} board
 * @returns {string|null} 'red', 'black', or null if game is ongoing
 */
export const checkWinner = (board) => {
  let redFound = false;
  let blackFound = false;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
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

  if (!redFound) return 'black';
  if (!blackFound) return 'red';
  return null;
};
