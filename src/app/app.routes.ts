import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'queuing',
    loadComponent: () => import('./queuing/queuing.component').then(m => m.QueuingComponent),
    data: { title: 'Queuing System' }
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
    data: { title: 'Queuing Settings' }
  },
  {
    path: '**',
    redirectTo: 'queuing',
    pathMatch: 'full'
  },
];
