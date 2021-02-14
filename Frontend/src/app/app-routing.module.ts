import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FeaturesComponent } from './pages/features/features.component';
import { IntegrationComponent } from './pages/integration/integration.component';
import { NavbarComponent } from './pages/nav/navbar/navbar.component'
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TimeComponent } from './pages/nav/time/time.component'
import { ProjectsComponent } from './pages/nav/projects/projects.component';
import { ReportsComponent } from './pages/nav/reports/reports.component';
import { ManageComponent } from './pages/nav/manage/manage.component';
import { HelpComponent } from './pages/nav/help/help.component';
import { ProfileComponent } from './pages/nav/profile/profile.component';
import { SettingsComponent } from './pages/nav/settings/settings.component';
import { LogoutComponent } from './pages/nav/logout/logout.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "features", component: FeaturesComponent },
  { path: "integration", component: IntegrationComponent },
  { path: "navbar", component: NavbarComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "time", component: TimeComponent,
    children: [
      { path: "projects", component: ProjectsComponent },
      { path: "reports", component: ReportsComponent },
      { path: "manage", component: ManageComponent },
      { path: "help", component: HelpComponent },
      { path: "profile", component: ProfileComponent },
      { path: "settings", component: SettingsComponent },
      { path: "logout", component: LogoutComponent }
    ]
  }

  // {
  //   path: "auth",
  //   loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule),
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
