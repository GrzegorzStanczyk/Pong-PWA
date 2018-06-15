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

  userPaddle: PaddleCords;
  enemyPaddle: PaddleCords;

  ball: Ball = {
    x: 100,
    y: 100,
    r: 10,
    xSpeed: 5,
    ySpeed: 5
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
          this.userPaddle = {
            x: 0,
            // y: window.innerHeight / 2,
            y,
            width: 40,
            height: 200
          };
          this.enemyPaddle = {
            x: window.innerWidth - 40,
            // y: this.ball.y - this.paddleSize.half,
            // y,
            y: this.ball.y - this.paddleSize.half,
            width: 40,
            height: 200
          };
          // this.ballMove();
          // this.ball = {
          //   x: cords.x,
          //   y: cords.y,
          //   r: 10,
          //   xSpeed: 5,
          //   ySpeed: 5
          // };
          this.ballMove();
          this.collision();
          return { userPaddle: this.userPaddle, enemyPaddle: this.enemyPaddle, ball: this.ball };
        })
      );
    }

    collision() {
      const nearestX = Math.max(this.userPaddle.x, Math.min(this.ball.x, this.userPaddle.x + this.userPaddle.width));
      const nearestY = Math.max(this.userPaddle.y, Math.min(this.ball.y, this.userPaddle.y + this.userPaddle.height));

      const deltaX = Math.abs(this.ball.x - nearestX);
      const deltaY = Math.abs(this.ball.y - nearestY);

      const collision = Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(this.ball.r, 2);
      if (collision) {
        console.log('collision: ', collision);
        console.log('deltaY: ', deltaY);
        console.log('deltaX: ', deltaX);
        if (deltaX < deltaY) {
          this.ball.ySpeed *= -1;
          this.ball.y += this.ball.ySpeed ;
        }  else if (deltaX > deltaY) {
          this.ball.xSpeed *= -1;
          this.ball.x += this.ball.xSpeed ;
        }  else if (deltaX === deltaY) {
          this.ball.ySpeed *= -1;
          this.ball.xSpeed *= -1;
          this.ball.x += this.ball.xSpeed ;
          this.ball.y += this.ball.ySpeed ;
        }
      }
    }

    ballMove() {
      if (this.ball.x + this.ball.r > this.enemyPaddle.x) {
        this.ball.xSpeed = this.ball.xSpeed * -1;
      }
      if (this.ball.x + this.ball.r >= window.innerWidth
        || this.ball.x - this.ball.r <= 0) {
        this.ball = {
          x: 100,
          y: 100,
          r: 10,
          xSpeed: 5,
          ySpeed: 5
        };
      }
      // bounce from up and bottom
      if (this.ball.y + this.ball.r >= window.innerHeight || this.ball.y - this.ball.r <= 0) {
        this.ball.ySpeed = this.ball.ySpeed * -1;
      }
      this.ball.x += this.ball.xSpeed;
      this.ball.y += this.ball.ySpeed;
    }
}
