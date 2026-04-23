import { Injectable, computed, inject, signal } from '@angular/core';
import { COPY } from '../../../shared/constants/copy';
import { ErrorService } from '../../../shared/services/error.service';
import { LevelStatus } from '../../../shared/models/level-status.model';
import { WheelHeight } from '../../../shared/models/wheel-height.model';
import { buildWheelHeights, calculateLevelStatus } from '../../../shared/utils/leveling-guidance';

@Injectable()
export class ReceiverStateService {
  private readonly errorService = inject(ErrorService);

  readonly orientation = signal({ pitch: 0, roll: 0 });
  readonly updatedAt = signal<number | null>(null);
  readonly statusMessage = signal<string>(COPY.receiver.waiting);
  readonly errorMessage = signal('');
  readonly guidanceMessage = signal<string>(COPY.receiver.waitingGuidance);

  readonly wheelHeights = computed<WheelHeight[]>(() => {
    const { pitch, roll } = this.orientation();
    return buildWheelHeights(pitch, roll);
  });
  readonly levelStatus = computed<LevelStatus>(() => {
    const { pitch, roll } = this.orientation();
    return calculateLevelStatus(pitch, roll, this.wheelHeights());
  });

  applyReading(reading: { pitch: number; roll: number; updatedAt?: number }, receivingMessage: string): void {
    this.orientation.set({ pitch: reading.pitch, roll: reading.roll });
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
