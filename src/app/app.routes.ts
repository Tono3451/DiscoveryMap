import { Routes } from '@angular/router';
import {LoginComponent} from './main-page/login/login.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./main-page/main-page.component').then(m => m.MainPageComponent),
  },
  { path: 'login',
    loadComponent: () => import('./main-page/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./main-page/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'create-account',
    loadComponent: () => import('./main-page/create-account/create-account.component').then(m => m.CreateAccountComponent)
  }
];
