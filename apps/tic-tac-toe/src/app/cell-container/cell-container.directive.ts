import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[ticTacToeCellContainer]'
})
export class CellContainerDirective {

  private readonly cellSize = '100px' 
  
  @HostBinding('style.display')
  private readonly display = 'grid'
  
  @HostBinding('style.grid-template-columns')
  private gridTemplate?: string;
  
  @Input() set ticTacToeCellContainer(value: number)  {
    this.gridTemplate = new Array(value).fill(this.cellSize).join(' ')
  };

}
