import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-receiver-metrics',
  imports: [DecimalPipe],
  templateUrl: './receiver-metrics.component.html',
  styleUrl: './receiver-metrics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverMetricsComponent {
  readonly pitch = input.required<number>();
  readonly roll = input.required<number>();
}

