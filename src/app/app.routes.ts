import { Routes } from '@angular/router';
import { ReceiverComponent } from './features/receiver/screen/receiver.component';
import { SenderComponent } from './features/sender/screen/sender.component';
import { OfflineLabComponent } from './features/offline/screen/offline-lab.component';
import { ManualComponent } from './features/manual/screen/manual.component';

export const routes: Routes = [
  {
    path: '',
    component: ReceiverComponent
  },
  {
    path: 'receiver',
    redirectTo: ''
  },
  {
    path: 'sender',
    component: SenderComponent
  },
  {
    path: 'offline',
    component: OfflineLabComponent
  },
  {
    path: 'manual',
    component: ManualComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];



