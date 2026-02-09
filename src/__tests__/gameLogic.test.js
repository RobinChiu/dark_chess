import {
  pieceNumber,
  initializePieces,
  createBoard,
  isAdjacentMove,
  canCapture,
  countPiecesBetween,
  isValidCannonMove,
  isValidMove,
  checkWinner
} from '../gameLogic';

describe('Game Logic Tests', () => {
  describe('initializePieces', () => {
    test('should return 32 pieces total', () => {
      const pieces = initializePieces();
      expect(pieces).toHaveLength(32);
    });

    test('should have 16 red pieces and 16 black pieces', () => {
      const pieces = initializePieces();
      const redPieces = pieces.filter(p => p.player === 'red');
      const blackPieces = pieces.filter(p => p.player === 'black');
      expect(redPieces).toHaveLength(16);
      expect(blackPieces).toHaveLength(16);
    });

    test('should have correct piece counts for black', () => {
      const pieces = initializePieces();
      const blackPieces = pieces.filter(p => p.player === 'black');

      expect(blackPieces.filter(p => p.type === '將')).toHaveLength(1);
      expect(blackPieces.filter(p => p.type === '士')).toHaveLength(2);
      expect(blackPieces.filter(p => p.type === '象')).toHaveLength(2);
      expect(blackPieces.filter(p => p.type === '車')).toHaveLength(2);
      expect(blackPieces.filter(p => p.type === '馬')).toHaveLength(2);
      expect(blackPieces.filter(p => p.type === '包')).toHaveLength(2);
      expect(blackPieces.filter(p => p.type === '卒')).toHaveLength(5);
    });

    test('should have correct piece counts for red', () => {
      const pieces = initializePieces();
      const redPieces = pieces.filter(p => p.player === 'red');

      expect(redPieces.filter(p => p.type === '帥')).toHaveLength(1);
      expect(redPieces.filter(p => p.type === '仕')).toHaveLength(2);
      expect(redPieces.filter(p => p.type === '相')).toHaveLength(2);
      expect(redPieces.filter(p => p.type === '俥')).toHaveLength(2);
      expect(redPieces.filter(p => p.type === '傌')).toHaveLength(2);
      expect(redPieces.filter(p => p.type === '炮')).toHaveLength(2);
      expect(redPieces.filter(p => p.type === '兵')).toHaveLength(5);
    });
  });

  describe('createBoard', () => {
    test('should create a 4x8 board', () => {
      const pieces = initializePieces();
      const board = createBoard(pieces);
      expect(board).toHaveLength(4);
      expect(board[0]).toHaveLength(8);
    });

    test('should place all 32 pieces on the board', () => {
      const pieces = initializePieces();
      const board = createBoard(pieces);
      let pieceCount = 0;

      board.forEach(row => {
        row.forEach(cell => {
          if (cell !== null) pieceCount++;
        });
      });

      expect(pieceCount).toBe(32);
    });
  });

  describe('isAdjacentMove', () => {
    test('should return true for horizontal adjacent move', () => {
      expect(isAdjacentMove(0, 0, 0, 1)).toBe(true);
      expect(isAdjacentMove(0, 1, 0, 0)).toBe(true);
    });

    test('should return true for vertical adjacent move', () => {
      expect(isAdjacentMove(0, 0, 1, 0)).toBe(true);
      expect(isAdjacentMove(1, 0, 0, 0)).toBe(true);
    });

    test('should return false for diagonal move', () => {
      expect(isAdjacentMove(0, 0, 1, 1)).toBe(false);
    });

    test('should return false for non-adjacent move', () => {
      expect(isAdjacentMove(0, 0, 0, 2)).toBe(false);
      expect(isAdjacentMove(0, 0, 2, 0)).toBe(false);
    });

    test('should return false for same position', () => {
      expect(isAdjacentMove(0, 0, 0, 0)).toBe(false);
    });
  });

  describe('canCapture', () => {
    test('should allow equal rank to capture', () => {
      expect(canCapture('將', '帥')).toBe(true);
      expect(canCapture('車', '俥')).toBe(true);
    });

    test('should allow lower rank number to capture higher rank number', () => {
      expect(canCapture('將', '車')).toBe(true);
      expect(canCapture('士', '馬')).toBe(true);
    });

    test('should not allow higher rank number to capture lower rank number', () => {
      expect(canCapture('卒', '車')).toBe(false);
      expect(canCapture('馬', '士')).toBe(false);
    });

    test('should allow 兵/卒 to capture 將/帥 (special rule)', () => {
      expect(canCapture('兵', '將')).toBe(true);
      expect(canCapture('卒', '帥')).toBe(true);
    });

    test('should not allow 將/帥 to be captured by 兵/卒 (special rule)', () => {
      expect(canCapture('將', '兵')).toBe(false);
      expect(canCapture('帥', '卒')).toBe(false);
    });
  });

  describe('countPiecesBetween', () => {
    test('should count pieces in horizontal line', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車' };
      board[0][2] = { type: '馬' };
      board[0][4] = { type: '包' };
      expect(countPiecesBetween(board, 0, 0, 0, 4)).toBe(1);
    });

    test('should count pieces in vertical line', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車' };
      board[2][0] = { type: '馬' };
      board[3][0] = { type: '包' };
      expect(countPiecesBetween(board, 0, 0, 3, 0)).toBe(1);
    });

    test('should return 0 when no pieces between', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車' };
      board[0][3] = { type: '包' };
      expect(countPiecesBetween(board, 0, 0, 0, 3)).toBe(0);
    });

    test('should return 1 when exactly one piece between', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車' };
      board[0][1] = { type: '馬' };
      board[0][2] = { type: '包' };
      expect(countPiecesBetween(board, 0, 0, 0, 2)).toBe(1);
    });

    test('should count multiple pieces between', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車' };
      board[0][1] = { type: '馬' };
      board[0][2] = { type: '士' };
      board[0][3] = { type: '包' };
      expect(countPiecesBetween(board, 0, 0, 0, 3)).toBe(2);
    });
  });

  describe('isValidCannonMove', () => {
    test('should return true when cannon jumps exactly one piece to capture', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][1] = { type: '馬', player: 'red' };
      board[0][2] = { type: '車', player: 'red' };
      expect(isValidCannonMove(board, board[0][0], board[0][2], 0, 0, 0, 2)).toBe(true);
    });

    test('should return false when no piece to jump over', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][2] = { type: '車', player: 'red' };
      expect(isValidCannonMove(board, board[0][0], board[0][2], 0, 0, 0, 2)).toBe(false);
    });

    test('should return false when more than one piece in between', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][1] = { type: '馬', player: 'red' };
      board[0][2] = { type: '士', player: 'black' };
      board[0][3] = { type: '車', player: 'red' };
      expect(isValidCannonMove(board, board[0][0], board[0][3], 0, 0, 0, 3)).toBe(false);
    });

    test('should return false when trying to capture same player piece', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][1] = { type: '馬', player: 'red' };
      board[0][2] = { type: '車', player: 'black' };
      expect(isValidCannonMove(board, board[0][0], board[0][2], 0, 0, 0, 2)).toBe(false);
    });

    test('should return false when target is empty', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][1] = { type: '馬', player: 'red' };
      expect(isValidCannonMove(board, board[0][0], null, 0, 0, 0, 2)).toBe(false);
    });
  });

  describe('isValidMove', () => {
    test('should allow regular piece to move to empty adjacent cell', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 1)).toBe(true);
    });

    test('should allow regular piece to capture weaker enemy piece', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'red' };
      board[0][1] = { type: '卒', player: 'black' };
      expect(isValidMove(board, 0, 0, 0, 1)).toBe(true);
    });

    test('should not allow regular piece to capture stronger enemy piece', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '卒', player: 'black' };
      board[0][1] = { type: '車', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 1)).toBe(false);
    });

    test('should not allow capturing same player piece', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'red' };
      board[0][1] = { type: '馬', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 1)).toBe(false);
    });

    test('should not allow non-adjacent move for regular pieces', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 2)).toBe(false);
    });

    test('should allow cannon to jump and capture', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][1] = { type: '馬', player: 'red' };
      board[0][2] = { type: '車', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 2)).toBe(true);
    });

    test('should not allow cannon to move without jumping', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '包', player: 'black' };
      board[0][2] = { type: '車', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 2)).toBe(false);
    });

    test('should return false when no piece at start position', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][1] = { type: '車', player: 'red' };
      expect(isValidMove(board, 0, 0, 0, 1)).toBe(false);
    });
  });

  describe('checkWinner', () => {
    test('should return null when both players have pieces', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'red' };
      board[0][1] = { type: '馬', player: 'black' };
      expect(checkWinner(board)).toBeNull();
    });

    test('should return "black" when no red pieces left', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'black' };
      board[0][1] = { type: '馬', player: 'black' };
      expect(checkWinner(board)).toBe('black');
    });

    test('should return "red" when no black pieces left', () => {
      const board = Array(4).fill(null).map(() => Array(8).fill(null));
      board[0][0] = { type: '車', player: 'red' };
      board[0][1] = { type: '馬', player: 'red' };
      expect(checkWinner(board)).toBe('red');
    });
  });

  describe('pieceNumber mapping', () => {
    test('should have correct values for all pieces', () => {
      expect(pieceNumber['將']).toBe(1);
      expect(pieceNumber['帥']).toBe(1);
      expect(pieceNumber['士']).toBe(2);
      expect(pieceNumber['仕']).toBe(2);
      expect(pieceNumber['象']).toBe(3);
      expect(pieceNumber['相']).toBe(3);
      expect(pieceNumber['車']).toBe(4);
      expect(pieceNumber['俥']).toBe(4);
      expect(pieceNumber['馬']).toBe(5);
      expect(pieceNumber['傌']).toBe(5);
      expect(pieceNumber['包']).toBe(6);
      expect(pieceNumber['炮']).toBe(6);
      expect(pieceNumber['卒']).toBe(7);
      expect(pieceNumber['兵']).toBe(7);
    });
  });
});
