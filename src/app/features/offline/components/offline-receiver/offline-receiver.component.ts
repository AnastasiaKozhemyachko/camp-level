import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { COPY } from '../../../../shared/constants/copy';
import { LocalReading } from '../../../../shared/models/local-reading.model';
import { ReceiverHeaderComponent } from '../../../../shared/components/receiver-header/receiver-header.component';
import { ReceiverMetricsComponent } from '../../../../shared/components/receiver-metrics/receiver-metrics.component';
import { ReceiverVisualizerComponent } from '../../../../shared/components/receiver-visualizer/receiver-visualizer.component';
import { ReceiverStateService } from '../../../receiver/services/receiver-state.service';
import { LocalBroadcastService } from '../../../../shared/services/local-broadcast.service';

@Component({
  selector: 'app-offline-receiver',
  providers: [ReceiverStateService],
  imports: [ReceiverHeaderComponent, ReceiverVisualizerComponent, ReceiverMetricsComponent],
  templateUrl: './offline-receiver.component.html',
  styleUrl: './offline-receiver.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineReceiverComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly localBroadcast = inject(LocalBroadcastService);
  private readonly state = inject(ReceiverStateService);

  protected readonly pitch = this.state.pitch;
  protected readonly roll = this.state.roll;
  protected readonly updatedAt = this.state.updatedAt;
  protected readonly statusMessage = this.state.statusMessage;
  protected readonly errorMessage = this.state.errorMessage;
  protected readonly wheelHeights = this.state.wheelHeights;
  protected readonly levelStatus = this.state.levelStatus;

  private subscription?: Subscription;

  constructor() {
    this.startListening();
    this.destroyRef.onDestroy(() => {
      this.subscription?.unsubscribe();
    });
  }

  private startListening(): void {
    this.subscription = this.localBroadcast.watchReading().subscribe((reading: LocalReading | null) => {
      if (reading) {
        this.state.applyReading(reading, COPY.receiver.receivingLocal);
      } else {
        this.state.setWaiting(COPY.offlineReceiver.waiting, COPY.offlineReceiver.waitingGuidance);
      }
    });
  }
}
