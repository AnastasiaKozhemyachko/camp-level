import { Injectable } from '@angular/core';
import { Observable, Subscriber, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OrientationReading } from '../models/orientation-reading.model';
import { IOSDeviceOrientationEvent } from '../types/orientation-event.type';

@Injectable({ providedIn: 'root' })
export class OrientationService {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
  }

  requestPermission(): Observable<void> {
    return new Observable<void>((subscriber: Subscriber<void>) => {
      if (!this.isSupported()) {
        subscriber.error(new Error('Device orientation is not supported on this device.'));
        return;
      }

      const orientationEvent = DeviceOrientationEvent as IOSDeviceOrientationEvent;

      if (typeof orientationEvent.requestPermission === 'function') {
        from(orientationEvent.requestPermission())
          .pipe(
            switchMap((permission) => {
              if (permission !== 'granted') {
                throw new Error('Motion access denied.');
              }
              return from([void 0]);
            })
          )
          .subscribe({
            next: () => {
              subscriber.next();
              subscriber.complete();
            },
            error: (error) => subscriber.error(error)
          });
      } else {
        subscriber.next();
        subscriber.complete();
      }
    });
  }

  watchOrientation(): Observable<OrientationReading> {
    return new Observable<OrientationReading>((subscriber: Subscriber<OrientationReading>) => {
      if (!this.isSupported()) {
        subscriber.error(new Error('Device orientation is not supported on this device.'));
        return undefined;
      }

      const handler = (event: DeviceOrientationEvent): void => {
        subscriber.next({
          pitch: event.beta ?? 0,
          roll: event.gamma ?? 0
        });
      };

      window.addEventListener('deviceorientation', handler, true);

      return () => {
        window.removeEventListener('deviceorientation', handler, true);
      };
    });
  }
}

