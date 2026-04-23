import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OfflineSenderComponent } from '../components/offline-sender/offline-sender.component';
import { OfflineReceiverComponent } from '../components/offline-receiver/offline-receiver.component';
import { LabLayoutComponent } from '../../../shared/components/lab-layout/lab-layout.component';

@Component({
  selector: 'app-offline-lab',
  imports: [LabLayoutComponent, OfflineSenderComponent, OfflineReceiverComponent],
  templateUrl: './offline-lab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineLabComponent {}
