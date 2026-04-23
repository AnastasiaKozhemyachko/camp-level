import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sender-actions',
  templateUrl: './sender-actions.component.html',
  styleUrl: './sender-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SenderActionsComponent {
  readonly isSupported = input.required<boolean>();
  readonly isTracking = input.required<boolean>();
  readonly isRequestingPermission = input.required<boolean>();

  readonly startSensor = output<void>();
  readonly stopTracking = output<void>();
}

