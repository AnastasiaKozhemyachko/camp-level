import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { COPY } from '../../../../shared/constants/copy';
import { LocalBroadcastService } from '../../../../shared/services/local-broadcast.service';
import { SenderRuntimeConfig } from '../../../sender/models/sender-runtime-config.model';
import { SenderRuntimeService } from '../../../sender/services/sender-runtime.service';

@Component({
  selector: 'app-offline-sender',
  providers: [SenderRuntimeService],
  imports: [DecimalPipe],
  templateUrl: './offline-sender.component.html',
  styleUrl: './offline-sender.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineSenderComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly localBroadcast = inject(LocalBroadcastService);
  private readonly runtime = inject(SenderRuntimeService);

  protected readonly isSupported = this.runtime.isSupported;
  protected readonly isTracking = this.runtime.isTracking;
  protected readonly isRequestingPermission = this.runtime.isRequestingPermission;
  protected readonly pitch = this.runtime.pitch;
  protected readonly roll = this.runtime.roll;
  protected readonly errorMessage = this.runtime.errorMessage;

  private dummyObservable(): Observable<void> {
    return of(void 0);
  }

  constructor() {
     const config: SenderRuntimeConfig = {
       syncIntervalMs: 1000,
       sendThreshold: 0,
       unsupportedMessage: COPY.sender.unsupported,
       waitingMessage: COPY.sender.waiting,
       runningMessage: COPY.offlineSender.running,
       startErrorMessage: COPY.sender.startError,
       stoppedMessage: COPY.sender.stopped,
       syncErrorMessage: COPY.offlineSender.syncError,
       writeReading: (reading) => {
         this.localBroadcast.broadcast(reading);
         return this.dummyObservable();
       }
     };

    this.runtime.configure(config);

    this.destroyRef.onDestroy(() => {
      this.runtime.destroy();
      this.localBroadcast.clear();
    });
  }

  protected startSensor(): void {
    this.runtime.start();
  }

  protected stopSensor(): void {
    this.runtime.stop();
    this.localBroadcast.clear();
  }
}
