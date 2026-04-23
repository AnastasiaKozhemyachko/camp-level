import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { COPY } from '../../../../shared/constants/copy';
import { SYNC_INTERVALS } from '../../../../shared/constants/thresholds';
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
export class OfflineSenderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly localBroadcast = inject(LocalBroadcastService);
  protected readonly runtime = inject(SenderRuntimeService);

  ngOnInit(): void {
    const config: SenderRuntimeConfig = {
      syncIntervalMs: SYNC_INTERVALS.DEFAULT_SYNC_INTERVAL,
      sendThreshold: 0,
      unsupportedMessage: COPY.sender.unsupported,
      waitingMessage: COPY.sender.waiting,
      runningMessage: COPY.offlineSender.running,
      startErrorMessage: COPY.sender.startError,
      stoppedMessage: COPY.sender.stopped,
      syncErrorMessage: COPY.offlineSender.syncError,
      writeReading: (reading) => {
        this.localBroadcast.broadcast(reading);
        return of(void 0);
      }
    };

    this.runtime.configure(config);

    this.destroyRef.onDestroy(() => {
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
