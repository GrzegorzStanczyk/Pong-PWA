import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { MouseMoveService, MouserCords } from './mouse-move.service';
import { Subscription, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Physics {
  userPaddle: PaddleCords;
  enemyPaddle: PaddleCords;
  ball?: {};
}

export interface PaddleCords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PaddleSize {
  width: number;
  height: number;
  half: number;
}

@Injectable({
  providedIn: CoreModule
})
export class PhysicsService {
  private physicsSubject: Subject<Physics> = new Subject<Physics>();
  physics$: Observable<Physics> = this.physicsSubject.asObservable();

  paddleSize: PaddleSize = {
    width: 40,
    height: 200,
    half: 0
  };

  constructor(
    private mouseMove: MouseMoveService) {
      this.paddleSize.half = this.paddleSize.height / 2;
      this.physics$ = combineLatest(this.mouseMove.mouseMove$)
      .pipe(
        map(([cords]: [MouserCords]) => {
          let y = cords.y - this.paddleSize.half;
          if (y < 0) {
            y = 0;
          }
          if (cords.y + this.paddleSize.half > window.innerHeight) {
            y = window.innerHeight - this.paddleSize.height;
          }
          console.log('y: ', y);
          const userPaddle = {
            x: 0,
            y,
            width: 40,
            height: 200
          };
          const enemyPaddle = {
            x: window.innerWidth - 40,
            y,
            width: 40,
            height: 200
          };
          const paddlePosition = {
            x1: userPaddle.x,
            x2: userPaddle.width,
            y1: userPaddle.y,
            y2: userPaddle.y + this.paddleSize.height
          };
          console.log('paddlePosition: ', paddlePosition);
          return { userPaddle, enemyPaddle };
        })
      );
    }
}
