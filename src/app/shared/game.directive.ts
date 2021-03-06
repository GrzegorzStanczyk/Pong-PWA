import { Directive, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhysicsService, Physics, PaddleCords, Ball } from '../core/physics.service';

@Directive({
  selector: '[appGame]'
})
export class GameDirective implements AfterViewInit, OnDestroy {
  private canvasEl: HTMLCanvasElement = this.el.nativeElement;
  private ctx: CanvasRenderingContext2D = this.canvasEl.getContext('2d');
  private subscriptions: Subscription = new Subscription();
  private animationFrame: any;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private physics: PhysicsService) {
    this.subscriptions.add(this.physics.physics$
      .subscribe(data => {
        this.ngZone.runOutsideAngular(() => {
          this.animationFrame = requestAnimationFrame(this.loop.bind(this, data));
        });
      })
    );
  }

  private setCanvasSize() {
    this.canvasEl.width = window.innerWidth;
    this.canvasEl.height = window.innerHeight;
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  private drawPaddle(cords: PaddleCords) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'red';
    this.ctx.rect(cords.x, cords.y, cords.width, cords.height);
    this.ctx.stroke();
  }

  private drawBall(ball: Ball) {
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  }

  private loop(data: Physics) {
    this.clearCanvas();
    this.drawBall(data.ball);
    // User paddle
    this.drawPaddle(data.userPaddle);
    // Enemy paddle
    this.drawPaddle(data.enemyPaddle);
  }

  ngAfterViewInit() {
    this.setCanvasSize();
    this.drawPaddle({ x: 0, y: window.innerHeight / 2 - 100, width: 40, height: 200 });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    cancelAnimationFrame(this.animationFrame);
  }

}
