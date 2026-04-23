import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { LocalBroadcastService } from '../../../../shared/services/local-broadcast.service';
import { AIRBAG_MAX_ANGLES } from '../../../../shared/constants/thresholds';

@Component({
  selector: 'app-manual-mock-sender',
  imports: [DecimalPipe],
  templateUrl: './manual-mock-sender.component.html',
  styleUrl: './manual-mock-sender.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualMockSenderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly localBroadcast = inject(LocalBroadcastService);

  protected readonly maxPitchDeg = AIRBAG_MAX_ANGLES.PITCH_DEG;
  protected readonly maxRollDeg = AIRBAG_MAX_ANGLES.ROLL_DEG;
  protected readonly pitchMax = +(AIRBAG_MAX_ANGLES.PITCH_DEG + AIRBAG_MAX_ANGLES.SLIDER_MARGIN_DEG).toFixed(1);
  protected readonly rollMax = +(AIRBAG_MAX_ANGLES.ROLL_DEG + AIRBAG_MAX_ANGLES.SLIDER_MARGIN_DEG).toFixed(1);

  protected readonly pitch = signal(0);
  protected readonly roll = signal(0);

  protected readonly pitchOverLimit = computed(() => Math.abs(this.pitch()) > this.maxPitchDeg);
  protected readonly rollOverLimit = computed(() => Math.abs(this.roll()) > this.maxRollDeg);
  protected readonly overLimit = computed(() => this.pitchOverLimit() || this.rollOverLimit());

  // effect() as field initializer runs in injection context — no constructor needed
  private readonly broadcastEffect = effect(() => {
    this.localBroadcast.broadcast({
      pitch: this.pitch(),
      roll: this.roll(),
      updatedAt: Date.now()
    });
  });

  ngOnInit(): void {
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
