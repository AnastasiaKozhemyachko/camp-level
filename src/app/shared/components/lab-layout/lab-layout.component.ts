import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-lab-layout',
  templateUrl: './lab-layout.component.html',
  styleUrl: './lab-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabLayoutComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly leftTitle = input('Sender');
}

