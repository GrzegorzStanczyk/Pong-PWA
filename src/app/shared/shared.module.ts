import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameDirective } from './game.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GameDirective
  ],
  exports: [
    GameDirective
  ]
})
export class SharedModule { }
