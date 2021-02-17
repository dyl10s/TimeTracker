import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';
import { CreateProjectComponent } from './shared/components/create-project/create-project.component';


const routes: Routes = [
  {
    path: 'auth',
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
    path: 'shared',
    children: [
      {
        path: 'components',
        children: [
          {
            path: 'create-project',
            component: CreateProjectComponent
          },
        ]
      },
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
