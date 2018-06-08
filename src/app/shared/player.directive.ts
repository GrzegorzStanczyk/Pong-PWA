import { Directive, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { MouseMoveService } from '../core/mouse-move.service';

@Directive({
  selector: '[appPlayer]'
})
export class PlayerDirective implements AfterViewInit {
  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private paddle;
  private animationFrame;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private mouseMove: MouseMoveService) {
    this.canvasEl = this.el.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');
    this.mouseMove.mouseMove$.subscribe(cords => console.log('cords', cords));
  }

  private setCanvasSize() {
    this.canvasEl.width = window.innerWidth;
    this.canvasEl.height = window.innerHeight;
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private drawPaddle() {
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.ctx.rect(0, 0, 25, 200);
    this.ctx.stroke();
  }

  private loop() {
    // this.clearCanvas();
    this.drawPaddle();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  ngAfterViewInit() {
    console.log('this.canvasEl: ', this.canvasEl);
    
    this.setCanvasSize();
    this.ngZone.runOutsideAngular(() => this.loop());
  }

}
