import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WheelHeight } from '../../models/wheel-height.model';
import { LevelStatus } from '../../models/level-status.model';

@Component({
  selector: 'app-receiver-visualizer',
  imports: [NgClass],
  templateUrl: './receiver-visualizer.component.html',
  styleUrl: './receiver-visualizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverVisualizerComponent {
  protected readonly Math = Math;

  readonly wheelHeights = input.required<WheelHeight[]>();
  readonly levelStatus = input.required<LevelStatus>();

  protected wheelAt(index: number): WheelHeight {
    return this.wheelHeights()[index] ?? { label: 'Unknown', lift: 0, isHighest: false };
  }

  protected getSeverityClass(): string {
    return `camper-visualizer--${this.levelStatus().severity}`;
  }

  protected isWheelToLift(wheelLabel: string): boolean {
    return this.levelStatus().wheelsToLift.includes(wheelLabel);
  }

  protected getInstructionText(): string {
    if (this.levelStatus().wheelsToLift.length === 0) {
      return '✅ All good!';
    }

    const details = this.levelStatus().wheelsToLift.map(label => {
      const wheel = this.wheelHeights().find(w => w.label === label);
      return wheel ? `${label} (${wheel.lift.toFixed(1)}°)` : label;
    });

    return `Start with: ${details.join(', then ')}`;
  }
}

