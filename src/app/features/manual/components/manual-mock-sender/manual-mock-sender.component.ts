import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { LocalBroadcastService } from '../../../../shared/services/local-broadcast.service';

@Component({
  selector: 'app-manual-mock-sender',
  imports: [DecimalPipe],
  templateUrl: './manual-mock-sender.component.html',
  styleUrl: './manual-mock-sender.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualMockSenderComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly localBroadcast = inject(LocalBroadcastService);

  protected readonly pitch = signal(0);
  protected readonly roll = signal(0);

  constructor() {
    effect(() => {
      this.localBroadcast.broadcast({
        pitch: this.pitch(),
        roll: this.roll(),
        updatedAt: Date.now()
      });
    });

    this.destroyRef.onDestroy(() => {
      this.localBroadcast.clear();
    });
  }

  protected onPitchInput(event: Event): void {
    this.pitch.set(this.getRangeValue(event));
  }

  protected onRollInput(event: Event): void {
    this.roll.set(this.getRangeValue(event));
  }

  protected reset(): void {
    this.pitch.set(0);
    this.roll.set(0);
  }

  private getRangeValue(event: Event): number {
    const input = event.target as HTMLInputElement | null;
    const value = input ? Number(input.value) : 0;
    return Number.isFinite(value) ? value : 0;
  }
}
