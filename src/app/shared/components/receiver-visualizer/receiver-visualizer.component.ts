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
  readonly wheelHeights = input.required<WheelHeight[]>();
  readonly levelStatus = input.required<LevelStatus>();


  protected getSeverityClass(): string {
    return `camper-visualizer--${this.levelStatus().severity}`;
  }

  protected isWheelToLift(wheelLabel: string): boolean {
    return this.levelStatus().wheelsToLift.includes(wheelLabel);
  }

  protected getInstructionText(): string {
    return this.levelStatus().message;
  }
}

