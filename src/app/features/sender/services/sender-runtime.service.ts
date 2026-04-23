import { Injectable, inject, signal } from '@angular/core';
import { Subscription, timer, Subject, EMPTY } from 'rxjs';
import { concatMap, catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { COPY } from '../../../shared/constants/copy';
import { ErrorService } from '../../../shared/services/error.service';
import { LevelReading } from '../../../shared/models/level-reading.model';
import { OrientationReading } from '../../../shared/models/orientation-reading.model';
import { OrientationService } from '../../../shared/services/orientation.service';
import { SenderRuntimeConfig } from '../models/sender-runtime-config.model';

@Injectable()
export class SenderRuntimeService {
  private readonly orientationService = inject(OrientationService);
  private readonly errorService = inject(ErrorService);

  readonly isSupported = this.orientationService.isSupported();
  readonly isTracking = signal(false);
  readonly isRequestingPermission = signal(false);
  readonly pitch = signal(0);
  readonly roll = signal(0);
  readonly lastSavedAt = signal<string | null>(null);
  readonly errorMessage = signal('');
  readonly statusMessage = signal<string>(
    this.isSupported ? COPY.sender.waiting : COPY.sender.unsupported
  );

  private config: SenderRuntimeConfig | null = null;
  private currentReading: OrientationReading | null = null;
  private lastSentReading: OrientationReading | null = null;
  private syncInProgress = false;
  private orientationSubscription?: Subscription;
  private syncSubscription?: Subscription;
  private destroy$ = new Subject<void>();

  configure(config: SenderRuntimeConfig): void {
    this.config = config;
    this.statusMessage.set(this.isSupported ? config.waitingMessage : config.unsupportedMessage);
  }

  start(): void {
    if (!this.config || !this.isSupported || this.isTracking() || this.isRequestingPermission()) {
      return;
    }

    this.errorMessage.set('');
    this.isRequestingPermission.set(true);

    this.orientationService.requestPermission()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isRequestingPermission.set(false))
      )
      .subscribe({
        next: () => {
          this.lastSentReading = null;
          this.startOrientationStream();
          this.startSyncLoop();
          this.isTracking.set(true);
          if (this.config) {
            this.statusMessage.set(this.config.runningMessage);
          }
        },
        error: (error) => {
          if (this.config) {
            this.statusMessage.set(this.config.startErrorMessage);
          }
          this.errorMessage.set(this.getErrorMessage(error));
        }
      });
  }

  stop(): void {
    this.orientationSubscription?.unsubscribe();
    this.orientationSubscription = undefined;

    this.syncSubscription?.unsubscribe();
    this.syncSubscription = undefined;

    this.isTracking.set(false);
    this.isRequestingPermission.set(false);
    this.syncInProgress = false;
    this.currentReading = null;
    this.lastSentReading = null;

    if (this.config) {
      this.statusMessage.set(this.isSupported ? this.config.stoppedMessage : this.config.unsupportedMessage);
    }
  }

  destroy(): void {
    this.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startOrientationStream(): void {
    this.orientationSubscription?.unsubscribe();

    this.orientationSubscription = this.orientationService.watchOrientation().subscribe({
      next: (reading) => {
        this.currentReading = reading;
        this.pitch.set(reading.pitch);
        this.roll.set(reading.roll);
      },
      error: (error) => {
        this.isTracking.set(false);
        this.statusMessage.set(COPY.sender.motionStopped);
        this.errorMessage.set(this.getErrorMessage(error));
      }
    });
  }

  private startSyncLoop(): void {
    if (!this.config || this.syncSubscription) {
      return;
    }

    this.syncSubscription = timer(this.config.syncIntervalMs, this.config.syncIntervalMs)
      .pipe(
        takeUntil(this.destroy$),
        concatMap(() => this.syncCurrentReading())
      )
      .subscribe({
        error: (error) => {
          console.error('Sync loop error:', error);
        }
      });
  }

  private syncCurrentReading() {
    if (!this.config || !this.isTracking() || !this.currentReading || this.syncInProgress) {
      return EMPTY;
    }

    if (!this.shouldSend(this.currentReading)) {
      return EMPTY;
    }

    this.syncInProgress = true;

    const payload: LevelReading = {
      pitch: this.currentReading.pitch,
      roll: this.currentReading.roll,
      updatedAt: Date.now()
    };

    return this.config!.writeReading(payload)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.lastSentReading = { ...this.currentReading! };
          this.lastSavedAt.set(new Date(payload.updatedAt).toLocaleTimeString());
          if (this.config) {
            this.statusMessage.set(this.config.runningMessage);
          }
        }),
        catchError((error) => {
          if (this.config) {
            this.statusMessage.set(this.config.syncErrorMessage);
          }
          this.errorMessage.set(`Write error: ${this.getErrorMessage(error)}`);
          return EMPTY;
        }),
        finalize(() => {
          this.syncInProgress = false;
        })
      );
  }

  private shouldSend(reading: OrientationReading): boolean {
    if (!this.config || !this.lastSentReading) {
      return true;
    }

    return (
      Math.abs(reading.pitch - this.lastSentReading.pitch) > this.config.sendThreshold ||
      Math.abs(reading.roll - this.lastSentReading.roll) > this.config.sendThreshold
    );
  }

  private getErrorMessage(error: unknown): string {
    return this.errorService.formatError(error);
  }
}

