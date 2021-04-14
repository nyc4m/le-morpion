import { TestBed } from '@angular/core/testing';

import { GameBoardService } from './game-board.service';

describe('GameBoardService', () => {
  let service: GameBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  beforeEach(() => service.init(3));

  it('Should init board with O and corresponding winning positions', (done) => {
    service.stateSnapshot$.subscribe((s) => {
      /**
       * 1 2 3
       * 4 5 6
       * 7 8 9
       */
      expect(s.current).toEqual('O');
      expect(s.winningPositions).toHaveLength(
        3 /*colonnes*/ + 3 /*lignes*/ + 2 /*diagonales*/
      );
      expect(s.winningPositions).toEqual(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [1, 4, 7],
          [2, 5, 8],
          [3, 6, 9],
          [1, 5, 9],
          [3, 5, 7],
        ],
      );
      done();
    });
  });
  it('Should update board and switch to next X player', (done) => {
    service.toggleCaseForCurrentPlayer(1);
    service.stateSnapshot$.subscribe((s) => {
      expect(s.board[0]).toEqual({ id: 1, player: 'O' });
      expect(s.current).toEqual('X');
      done();
    });
  });

  describe('playing on an already owned cell', () => {
    beforeEach(() => {
      service.toggleCaseForCurrentPlayer(1);
    });
    it('should throw an error', (done) => {
      service.errors$.subscribe((error) => {
        expect(error).toBe('Cell is already owned by O');
        done();
      });
      service.toggleCaseForCurrentPlayer(1);
    });
    it('should keep cell ownership to O', (done) => {
      service.board$.subscribe((s) => {
        expect(s.find((c) => c.id === 1)?.player).toBe('O');
        done();
      });
    });
  });

  it.each`
    winner       | loser
    ${[1, 5, 9]} | ${[2, 3]}
    ${[3, 5, 7]} | ${[2, 1]}
    ${[4, 5, 6]} | ${[2, 3]}
  `(
    'should determine when the game is over for O, and designate a winner',
    //@ts-ignore
    ({ winner, loser }, done: any) => {
      service.toggleCaseForCurrentPlayer(winner[0]); //0
      service.toggleCaseForCurrentPlayer(loser[0]); //X

      service.toggleCaseForCurrentPlayer(winner[1]); //0
      service.toggleCaseForCurrentPlayer(loser[1]); //X

      service.toggleCaseForCurrentPlayer(winner[2]); //0
      service.stateSnapshot$.subscribe((state) => {
        expect(state.winner).toBe('O');
        done();
      });
    }
  );

  describe('when the game is won by one of the player', () => {
    beforeEach(() => {
      const winner = [1, 5, 9];
      const loser = [2, 3];
      service.toggleCaseForCurrentPlayer(winner[0]); //0
      service.toggleCaseForCurrentPlayer(loser[0]); //X

      service.toggleCaseForCurrentPlayer(winner[1]); //0
      service.toggleCaseForCurrentPlayer(loser[1]); //X

      service.toggleCaseForCurrentPlayer(winner[2]); //0
    });

    it('should prevent the game from continuing when a player has won', async (done) => {
      const expectedState = await service.stateSnapshot$.toPromise();
      service.toggleCaseForCurrentPlayer(7);

      service.stateSnapshot$.subscribe((state) => {
        expect(state).toEqual(expectedState);
        done();
      });
    });

    it("should throw an error specifying why it's not possioble to play anymore", (done) => {
      service.errors$.subscribe((error) => {
        expect(error).toBe('Player O has won the game');
        done();
      });

      service.toggleCaseForCurrentPlayer(7);
    });
  });
});
