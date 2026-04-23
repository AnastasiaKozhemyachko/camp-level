import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mode-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mode-nav.component.html',
  styleUrl: './mode-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModeNavComponent {}

