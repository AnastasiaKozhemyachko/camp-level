import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModeNavComponent } from '../shared/components/mode-nav/mode-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModeNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}

