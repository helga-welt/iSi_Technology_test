import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component'
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component'
import {
  ForbiddenPageComponent
} from './pages/forbidden-page/forbidden-page.component'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenPageComponent
  },
  {
    path: '**', pathMatch: 'full',
    component: PageNotFoundComponent
  },
];
