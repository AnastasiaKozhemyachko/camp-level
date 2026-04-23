import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OfflineReceiverComponent } from '../../offline/components/offline-receiver/offline-receiver.component';
import { ManualMockSenderComponent } from '../components/manual-mock-sender/manual-mock-sender.component';
import { LabLayoutComponent } from '../../../shared/components/lab-layout/lab-layout.component';

@Component({
  selector: 'app-manual',
  imports: [LabLayoutComponent, ManualMockSenderComponent, OfflineReceiverComponent],
  templateUrl: './manual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualComponent {}
