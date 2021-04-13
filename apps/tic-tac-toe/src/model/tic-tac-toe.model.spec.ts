import { createBoard } from './tic-tac-toe.model';

describe('Tic tac toe model', () => {
  it('should create tic tac toe board', () => {
    const board = createBoard(3);
    expect(board).toEqual([
      {
        id: 1,
        player: null,
      },
      {
        id: 2,
        player: null,
      },
      {
        id: 3,
        player: null,
      },
    ]);
  });
});
