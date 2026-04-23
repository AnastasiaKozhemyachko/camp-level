import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalReading } from '../models/local-reading.model';

@Injectable({ providedIn: 'root' })
export class LocalBroadcastService {
  private readonly readingSubject = new BehaviorSubject<LocalReading | null>(null);

  watchReading(): Observable<LocalReading | null> {
    return this.readingSubject.asObservable();
  }

  broadcast(reading: LocalReading): void {
    this.readingSubject.next(reading);
  }

  clear(): void {
    this.readingSubject.next(null);
  }
}

