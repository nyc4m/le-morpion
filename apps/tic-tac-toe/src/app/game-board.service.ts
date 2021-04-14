import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { Case, createBoard, TicTacToePlayer } from '../model/tic-tac-toe.model';

type GameState = {
  winner: TicTacToePlayer | null;
  current: TicTacToePlayer;
  winningPositions: number[][];
  board: ReadonlyArray<Case>;
};

const nullValues = <T>(v: T | null): v is T => Boolean(v);

@Injectable({
  providedIn: 'root',
})
export class GameBoardService {

  errors$ = new Subject();

  state$ = new BehaviorSubject<GameState | null>(null);

  /**
   * Get the current state and immediately unsubscribe
   */
  readonly stateSnapshot$ = this.state$.pipe(take(1), filter(nullValues));

  readonly currentPlayerSnapshot$ = this.stateSnapshot$.pipe(
    filter(nullValues),
    pluck('current')
  );

  board$ = this.state$.pipe(filter(nullValues), pluck('board'));

  currentPlayer$ = this.state$.pipe(
    filter(nullValues),
    map((s) => s.current)
  );

  winner$ = this.state$.pipe(map((s) => s?.winner));

  init(boardSize: number) {
    this.state$.next({
      winner: null,
      current: 'O',
      board: createBoard(Math.pow(boardSize, 2)),
      winningPositions: this.generateWinningPositions(boardSize),
    });
  }

  private generateWinningPositions(size: number): number[][] {
    const lines = this.chunk([...Array(Math.pow(size, 2)).keys()].map(i => i+1), size)
    const cols = this.transpose(lines)

    let diagonal1 = [] as number[]
    let diagonal2 = [] as number[]
    
    for(let i = 0; i < size; i++) {
      diagonal1.push(1+(i*(size+1)))
      diagonal2.push(size+(i*(size-1)))
    }
    
    return [
      ...lines, ...cols, diagonal1, diagonal2
    ];
  }

  private readonly chunk = (cells: number[], size: number): number[][] => {
    if(cells.length === size) {
      return [cells];
    }
    return [cells.slice(0, size)].concat(this.chunk(cells.slice(size), size))
  }

  /**
   * Apply the following transformation
   * 1 2 3    1 4 7
   * 4 5 6 => 2 5 8
   * 7 8 9    3 6 9
   * @param lines 2D array
   * @returns a new array, which is the transposition of the input
   */
  private transpose(lines: number[][]): number[][] {
    return lines.map((_, index) => lines.map(line => line[index]));
  }

  toggleCaseForCurrentPlayer(id: number): void {
    this.stateSnapshot$
      .pipe(
        switchMap((s) => {
          return s.winner
            ? throwError(`Player ${s.winner} has won the game`)
            : of(s);
        }),
        this.throwIfCellIsOwned(id),
        map((s) => ({ ...s, nextPlayer: this.nextPlayer(s.current) }))
      )
      .subscribe(
        (s: GameState & { nextPlayer: TicTacToePlayer }) => {
          const { board } = s;
          const newBoard = board.map((c) =>
            c.id === id ? { ...c, player: s.current } : c
          );
          this.state$.next({
            ...s,
            board: newBoard,
            current: s.nextPlayer,
            winner: this.determineWinner(s.current, newBoard, s.winningPositions),
          });
        },
        (err) => this.errors$.next(err)
      );
  }

  readonly determineWinner = (
    currentPlayer: TicTacToePlayer,
    cells: readonly Case[],
    winningPositions: number[][]
  ): TicTacToePlayer | null => {
    return winningPositions.find((lines) => {
      return lines.every(
        (cellId) => cells[cellId - 1].player === currentPlayer
      );
    })
      ? currentPlayer
      : null;
  };

  readonly nextPlayer = (current: TicTacToePlayer): TicTacToePlayer =>
    current === 'O' ? 'X' : 'O';

  readonly throwIfCellIsOwned = (id: number) => (obs: Observable<GameState>) =>
    obs.pipe(
      switchMap((s) => {
        const cell = s.board.find((c) => c.id === id);
        if (!cell) {
          return throwError(`Cell does not exist`);
        }
        if (cell.player) {
          return throwError(`Cell is already owned by ${cell.player}`);
        }
        return of(s);
      })
    );
}
