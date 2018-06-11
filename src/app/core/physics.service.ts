import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { MouseMoveService, MouserCords } from './mouse-move.service';
import { Subscription, Observable, Subject, interval, animationFrameScheduler } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';

export interface Physics {
  userPaddle: PaddleCords;
  enemyPaddle: PaddleCords;
  ball: Ball;
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

export interface Ball {
  x: number;
  y: number;
  r: number;
  xSpeed: number;
  ySpeed: number;
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

  ball: Ball = {
    x: 20,
    y: 20,
    r: 10,
    xSpeed: 2,
    ySpeed: 2
  };

  constructor(
    private mouseMove: MouseMoveService) {
      this.paddleSize.half = this.paddleSize.height / 2;
      this.physics$ = interval(0, animationFrameScheduler).pipe(
        withLatestFrom(this.mouseMove.mouseMove$),
        map(([event, cords]: [number, MouserCords]) => {
          let y = cords.y - this.paddleSize.half;
          if (y < 0) {
            y = 0;
          }
          if (cords.y + this.paddleSize.half > window.innerHeight) {
            y = window.innerHeight - this.paddleSize.height;
          }
          this.ballMove();
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
          return { userPaddle, enemyPaddle, ball: this.ball };
        })
      );
    }

    ballMove() {
      if (this.ball.x + this.ball.r >= window.innerWidth || this.ball.x - this.ball.r <= 0) {
        this.ball.xSpeed = this.ball.xSpeed * -1;
      }
      if (this.ball.y + this.ball.r >= window.innerHeight || this.ball.y - this.ball.r <= 0) {
        this.ball.ySpeed = this.ball.ySpeed * -1;
      }
      this.ball = {
        x: this.ball.x + this.ball.xSpeed,
        y: this.ball.y + this.ball.ySpeed,
        r: 10,
        xSpeed: this.ball.xSpeed,
        ySpeed: this.ball.ySpeed
      };
    }
}
