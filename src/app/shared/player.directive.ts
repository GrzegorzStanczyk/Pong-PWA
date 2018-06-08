import { Directive, ElementRef, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { MouseMoveService, MouserCords } from '../core/mouse-move.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appPlayer]'
})
export class PlayerDirective implements AfterViewInit, OnDestroy {
  private canvasEl: HTMLCanvasElement = this.el.nativeElement;
  private ctx: CanvasRenderingContext2D = this.canvasEl.getContext('2d');
  private subscriptions: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private mouseMove: MouseMoveService) {
    this.subscriptions.add(this.mouseMove.mouseMove$
      .subscribe(cords => {
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.loop(cords);
          });
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

  private drawPaddle(cords: MouserCords) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 50;
    this.ctx.strokeStyle = 'red';
    let y = cords.y - 100;
    if (y < 0) {
      y = 0;
    }
    if (cords.y + 100 > window.innerHeight) {
      y = window.innerHeight - 200;
    }
    this.ctx.rect(0, y, 0, 200);
    this.ctx.stroke();
  }

  private loop(cords: MouserCords) {
    this.clearCanvas();
    this.drawPaddle(cords);
  }

  ngAfterViewInit() {
    this.setCanvasSize();
    this.drawPaddle({ y: window.innerHeight / 2 - 100 });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
