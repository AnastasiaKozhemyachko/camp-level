import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COPY } from '../../../../shared/constants/copy';
import { LocalReading } from '../../../../shared/models/local-reading.model';
import { ReceiverHeaderComponent } from '../../../../shared/components/receiver-header/receiver-header.component';
import { ReceiverVisualizerComponent } from '../../../../shared/components/receiver-visualizer/receiver-visualizer.component';
import { ReceiverStateService } from '../../../receiver/services/receiver-state.service';
import { LocalBroadcastService } from '../../../../shared/services/local-broadcast.service';

@Component({
  selector: 'app-offline-receiver',
  providers: [ReceiverStateService],
  imports: [ReceiverHeaderComponent, ReceiverVisualizerComponent],
  templateUrl: './offline-receiver.component.html',
  styleUrl: './offline-receiver.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineReceiverComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly localBroadcast = inject(LocalBroadcastService);
  protected readonly state = inject(ReceiverStateService);

  ngOnInit(): void {
    this.startListening();
  }

  private startListening(): void {
    this.localBroadcast.watchReading().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((reading: LocalReading | null) => {
      if (reading) {
        this.state.applyReading(reading, COPY.receiver.receivingLocal);
      } else {
        this.state.setWaiting(COPY.offlineReceiver.waiting, COPY.offlineReceiver.waitingGuidance);
      }
    });
  }
}
