import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sender-metrics',
  imports: [DecimalPipe],
  templateUrl: './sender-metrics.component.html',
  styleUrl: './sender-metrics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SenderMetricsComponent {
  readonly pitch = input.required<number>();
  readonly roll = input.required<number>();
}

