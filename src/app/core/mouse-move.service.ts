import { Injectable, NgZone } from '@angular/core';
import { CoreModule } from './core.module';
import { Subject, Observable } from 'rxjs';
import { EventManager } from '@angular/platform-browser';

export interface MouserCords {
  x: number;
  y: number;
};

@Injectable({
  providedIn: CoreModule
})
export class MouseMoveService {
  private mouseMoveSubject: Subject<MouserCords> = new Subject<MouserCords>();
  mouseMove$: Observable<MouserCords> = this.mouseMoveSubject.asObservable();

  constructor(
    private eventManager: EventManager,
    private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.eventManager.addGlobalEventListener('window', 'mousemove', this.onMouseMove.bind(this));
    });
  }

  private onMouseMove(event: MouseEvent) {
    this.mouseMoveSubject.next({ x: event.clientX, y: event.clientX });
  }
}
