import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerDirective } from './player.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PlayerDirective
  ],
  exports: [
    PlayerDirective
  ]
})
export class SharedModule { }
