import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import ChessBoard from '../ChessBoard';

describe('ChessBoard Component', () => {
  test('renders the board with 4 rows and 8 columns', () => {
    const { container } = render(<ChessBoard />);
    const boardRows = container.querySelectorAll('.board-row');
    expect(boardRows).toHaveLength(4);

    boardRows.forEach(row => {
      const cells = row.querySelectorAll('.board-cell');
      expect(cells).toHaveLength(8);
    });
  });

  test('flips a piece when clicked', () => {
    const { container } = render(<ChessBoard />);
    const piece = container.querySelectorAll('.piece')[0];
    expect(piece).toHaveClass('mask');
    fireEvent.click(piece);
    expect(piece).not.toHaveClass('mask');
  });

  test('displays current player after first flip', () => {
    const { container } = render(<ChessBoard />);
    const gameInfo = container.querySelector('.game-info');
    expect(gameInfo).toHaveTextContent('Current Player: ?');

    const piece = container.querySelectorAll('.piece')[0];
    fireEvent.click(piece);

    // After first flip, player should change
    expect(gameInfo).not.toHaveTextContent('Current Player: ?');
  });

  test('displays game status as ongoing initially', () => {
    const { container } = render(<ChessBoard />);
    const gameInfo = container.querySelector('.game-info');
    expect(gameInfo).toHaveTextContent('Game Status: ongoing');
  });

  test('displays captured pieces sections', () => {
    const { container } = render(<ChessBoard />);
    const gameInfo = container.querySelector('.game-info');
    expect(gameInfo).toHaveTextContent('Captured Pieces: Red');
    expect(gameInfo).toHaveTextContent('Captured Pieces: Black');
  });

  test('initializes board with 32 pieces', () => {
    const { container } = render(<ChessBoard />);
    const pieces = container.querySelectorAll('.piece.mask');

    // Initially all pieces should be masked (not flipped)
    expect(pieces).toHaveLength(32);
  });

  test('board maintains structure after interactions', () => {
    const { container } = render(<ChessBoard />);

    // Flip a piece
    const piece = container.querySelectorAll('.piece')[0];
    fireEvent.click(piece);

    // Board structure should remain
    const boardRows = container.querySelectorAll('.board-row');
    expect(boardRows).toHaveLength(4);

    boardRows.forEach(row => {
      const cells = row.querySelectorAll('.board-cell');
      expect(cells).toHaveLength(8);
    });
  });

//   test('moves a piece to a valid position', () => {
//     render(<ChessBoard />);
//     const piece = screen.getAllByRole('button')[0];
//     fireEvent.click(piece); // Select the piece

//     const targetCell = screen.getAllByRole('button')[1];
//     fireEvent.click(targetCell); // Move the piece

//     expect(targetCell).toHaveTextContent(piece.textContent);
//   });

//   test('does not move a piece to an invalid position', () => {
//     render(<ChessBoard />);
//     const piece = screen.getAllByRole('button')[0];
//     fireEvent.click(piece); // Select the piece

//     const targetCell = screen.getAllByRole('button')[10]; // Invalid move
//     fireEvent.click(targetCell); // Attempt to move the piece

//     expect(targetCell).not.toHaveTextContent(piece.textContent);
//   });

//   test('captures an opponent piece', () => {
//     render(<ChessBoard />);
//     const piece = screen.getAllByRole('button')[0];
//     fireEvent.click(piece); // Select the piece

//     const targetCell = screen.getAllByRole('button')[1];
//     fireEvent.click(targetCell); // Move the piece

//     const opponentPiece = screen.getAllByRole('button')[2];
//     fireEvent.click(opponentPiece); // Select the opponent piece

//     const captureCell = screen.getAllByRole('button')[1];
//     fireEvent.click(captureCell); // Capture the piece

//     expect(captureCell).toHaveTextContent(opponentPiece.textContent);
//   });
});
