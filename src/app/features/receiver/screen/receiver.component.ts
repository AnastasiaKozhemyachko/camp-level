import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { COPY } from '../../../shared/constants/copy';
import { LevelReading } from '../../../shared/models/level-reading.model';
import { ReceiverHeaderComponent } from '../../../shared/components/receiver-header/receiver-header.component';
import { ReceiverMetricsComponent } from '../../../shared/components/receiver-metrics/receiver-metrics.component';
import { ReceiverVisualizerComponent } from '../../../shared/components/receiver-visualizer/receiver-visualizer.component';
import { ReceiverStateService } from '../services/receiver-state.service';
import { LevelService } from '../../../shared/services/level.service';

@Component({
  selector: 'app-receiver',
  providers: [ReceiverStateService],
  imports: [ReceiverHeaderComponent, ReceiverVisualizerComponent, ReceiverMetricsComponent],
  templateUrl: './receiver.component.html',
  styleUrl: './receiver.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverComponent {

  private readonly destroyRef = inject(DestroyRef);
  private readonly levelService = inject(LevelService);
  private readonly state = inject(ReceiverStateService);

  protected readonly pitch = this.state.pitch;
  protected readonly roll = this.state.roll;
  protected readonly updatedAt = this.state.updatedAt;
  protected readonly statusMessage = this.state.statusMessage;
  protected readonly errorMessage = this.state.errorMessage;
  protected readonly wheelHeights = this.state.wheelHeights;
  protected readonly levelStatus = this.state.levelStatus;

  private snapshotSubscription?: Subscription;

  constructor() {
    this.startListening();

    this.destroyRef.onDestroy(() => {
      this.snapshotSubscription?.unsubscribe();
    });
  }

  private startListening(): void {
    this.snapshotSubscription = this.levelService.watchCurrentLevel().subscribe({
      next: (reading: LevelReading | null) => this.applyReading(reading),
      error: (error: unknown) => {
        this.state.setError(COPY.receiver.readError, error);
      }
    });
  }

  private applyReading(reading: LevelReading | null): void {
    if (!reading) {
      this.state.setWaiting(COPY.receiver.waitingForFirstSync, COPY.receiver.waitingForSenderGuidance);
      return;
    }

    this.state.applyReading(reading, COPY.receiver.receivingFirestore);
  }
}

