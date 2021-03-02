import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './views/dashboard/projects/projects.component';

import { LogoutComponent } from './views/auth/logout/logout.component';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { ProfileComponent } from './views/dashboard/profile/profile.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProjectDetailsComponent } from './views/dashboard/project-details/project-details.component';
import { HomeComponent } from './shared/components/home/home.component';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [ AuthGuard ],
    data: { isAuth: true },
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
    ]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'dashboard',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'projects',
        component: ProjectsComponent
      },
      {
        path: 'projects/:id',
        component: ProjectDetailsComponent
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  } //Make sure this object is the last item in the array. Add all new routes above this one.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
