import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { COPY } from '../../../shared/constants/copy';
import { LevelService } from '../../../shared/services/level.service';
import { SenderRuntimeConfig } from '../models/sender-runtime-config.model';
import { SenderRuntimeService } from '../services/sender-runtime.service';
import { SenderActionsComponent } from '../components/sender-actions/sender-actions.component';
import { SenderMetricsComponent } from '../components/sender-metrics/sender-metrics.component';
import { SenderStatusComponent } from '../components/sender-status/sender-status.component';

@Component({
  selector: 'app-sender',
  providers: [SenderRuntimeService],
  imports: [
    SenderActionsComponent,
    SenderStatusComponent,
    SenderMetricsComponent
  ],
  templateUrl: './sender.component.html',
  styleUrl: './sender.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SenderComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly levelService = inject(LevelService);
  private readonly runtime = inject(SenderRuntimeService);

  protected readonly isSupported = this.runtime.isSupported;
  protected readonly isTracking = this.runtime.isTracking;
  protected readonly isRequestingPermission = this.runtime.isRequestingPermission;
  protected readonly pitch = this.runtime.pitch;
  protected readonly roll = this.runtime.roll;
  protected readonly lastSavedAt = this.runtime.lastSavedAt;
  protected readonly errorMessage = this.runtime.errorMessage;
  protected readonly statusMessage = this.runtime.statusMessage;
  protected readonly syncIntervalLabel = `${environment.syncIntervalMs / 1000} seconds`;

  constructor() {
    const config: SenderRuntimeConfig = {
      syncIntervalMs: environment.syncIntervalMs,
      sendThreshold: environment.sendThreshold,
      unsupportedMessage: COPY.sender.unsupported,
      waitingMessage: COPY.sender.waiting,
      runningMessage: COPY.sender.running,
      startErrorMessage: COPY.sender.startError,
      stoppedMessage: COPY.sender.stopped,
      syncErrorMessage: COPY.sender.syncError,
      writeReading: (reading) => this.levelService.saveCurrentLevel(reading)
    };

    this.runtime.configure(config);

    this.destroyRef.onDestroy(() => {
      this.runtime.destroy();
    });
  }

  protected startSensor(): void {
    this.runtime.start();
  }

  protected stopTracking(): void {
    this.runtime.stop();
  }
}

