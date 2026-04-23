import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-receiver-header',
  imports: [DatePipe],
  templateUrl: './receiver-header.component.html',
  styleUrl: './receiver-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverHeaderComponent {
  readonly statusMessage = input.required<string>();
  readonly errorMessage = input.required<string>();
  readonly updatedAt = input.required<number | null>();
}

