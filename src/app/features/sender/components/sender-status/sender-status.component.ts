import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-sender-status',
  templateUrl: './sender-status.component.html',
  styleUrl: './sender-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SenderStatusComponent {
  readonly statusMessage = input.required<string>();
  readonly errorMessage = input.required<string>();
  readonly lastSavedAt = input.required<string | null>();
  readonly syncIntervalLabel = input.required<string>();
}

