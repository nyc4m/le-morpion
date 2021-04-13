import { Component, OnInit } from '@angular/core';
import { GameBoardService } from './game-board.service';

@Component({
  selector: 'tic-tac-toe-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {

  readonly size = 3;
  
  constructor(public gameBoard: GameBoardService) {}

  play(id: number) {
    this.gameBoard.toggleCaseForCurrentPlayer(id);
  }

  ngOnInit() {
    this.gameBoard.init(this.size);
  }
}
