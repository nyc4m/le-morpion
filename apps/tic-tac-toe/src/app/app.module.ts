import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CellContainerDirective } from './cell-container/cell-container.directive';

@NgModule({
  declarations: [AppComponent, CellContainerDirective],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
