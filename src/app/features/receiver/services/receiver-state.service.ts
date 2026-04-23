import { Injectable, computed, inject, signal } from '@angular/core';
import { COPY } from '../../../shared/constants/copy';
import { ErrorService } from '../../../shared/services/error.service';
import { LevelStatus } from '../../../shared/models/level-status.model';
import { WheelHeight } from '../../../shared/models/wheel-height.model';
import { buildWheelHeights, calculateLevelStatus } from '../../../shared/utils/leveling-guidance';

@Injectable()
export class ReceiverStateService {
  private readonly errorService = inject(ErrorService);

  readonly pitch = signal(0);
  readonly roll = signal(0);
  readonly updatedAt = signal<number | null>(null);
  readonly statusMessage = signal<string>(COPY.receiver.waiting);
  readonly errorMessage = signal('');
  readonly guidanceMessage = signal<string>(COPY.receiver.waitingGuidance);

  readonly wheelHeights = computed<WheelHeight[]>(() => buildWheelHeights(this.pitch(), this.roll()));
  readonly levelStatus = computed<LevelStatus>(() => calculateLevelStatus(this.pitch(), this.roll(), this.wheelHeights()));

  applyReading(reading: { pitch: number; roll: number; updatedAt?: number }, receivingMessage: string): void {
    this.pitch.set(reading.pitch);
    this.roll.set(reading.roll);
    this.updatedAt.set(reading.updatedAt || Date.now());
    this.statusMessage.set(receivingMessage);
    this.errorMessage.set('');
    this.guidanceMessage.set(this.levelStatus().message);
  }

  setWaiting(statusMessage: string, guidanceMessage: string): void {
    this.statusMessage.set(statusMessage);
    this.guidanceMessage.set(guidanceMessage);
  }

  setError(statusMessage: string, error: unknown): void {
    this.statusMessage.set(statusMessage);
    this.errorMessage.set(this.errorService.formatError(error));
  }
}

