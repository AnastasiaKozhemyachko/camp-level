import { Injectable } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { DocumentData, doc, DocumentSnapshot, Firestore, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { Observable, Subscriber, from } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LevelReading } from '../models/level-reading.model';

const firebaseApp: FirebaseApp = getApps().length > 0
  ? getApp()
  : initializeApp(environment.firebaseConfig);
const firestore: Firestore = getFirestore(firebaseApp);

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly currentLevelRef = doc(firestore, 'level', 'current');

  watchCurrentLevel(): Observable<LevelReading | null> {
    return new Observable<LevelReading | null>((subscriber: Subscriber<LevelReading | null>) => {
      return onSnapshot(
        this.currentLevelRef,
        (snapshot: DocumentSnapshot) => {
          const data = snapshot.data();

          if (!data) {
            subscriber.next(null);
            return;
          }

          subscriber.next(this.mapReading(data));
        },
        (error: FirebaseError) => subscriber.error(error)
      );
    });
  }

  saveCurrentLevel(reading: LevelReading): Observable<void> {
    return from(setDoc(this.currentLevelRef, reading));
  }

  private mapReading(data: DocumentData): LevelReading {
    return {
      pitch: this.toFiniteNumber(data['pitch']),
      roll: this.toFiniteNumber(data['roll']),
      updatedAt: this.toFiniteNumber(data['updatedAt'])
    };
  }

  private toFiniteNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }
}

