import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class ReceiverComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly levelService = inject(LevelService);
  protected readonly state = inject(ReceiverStateService);

  ngOnInit(): void {
    this.startListening();
  }

  private startListening(): void {
    this.levelService.watchCurrentLevel().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
