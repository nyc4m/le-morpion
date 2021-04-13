import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CellContainerDirective } from './cell-container.directive';

@Component({
  template: `<div [ticTacToeCellContainer]='3'></div>`
})
class TestHost {
  @ViewChild(CellContainerDirective) container?: ViewChild;
}

describe('CellContainerDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
          TestHost, CellContainerDirective
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(TestHost)
  })

  beforeEach(() => fixture.detectChanges())
  
  it('should create an instance', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
  
  it('should create a square grid of 3x3', () => {
    const directive = fixture.debugElement.query(By.directive(CellContainerDirective))
    expect(directive.styles).toEqual({
      display: 'grid',
      'grid-template-columns': '100px 100px 100px'
    })
  })
});
