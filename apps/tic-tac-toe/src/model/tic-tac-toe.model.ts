export type TicTacToePlayer = 'X' | 'O';

export type Case = {
  readonly id: number 
  readonly player: TicTacToePlayer | null;
};

export function createBoard(size: number) {
  const board = [] as Case[];
  for(let i = 0; i<size; i++) {
    board.push({
      id: i+1,
      player: null
    })
  }
  return board;
}
