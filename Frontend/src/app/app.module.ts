import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { FeaturesComponent } from './pages/features/features.component';
import { IntegrationComponent } from './pages/integration/integration.component';
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
import { NavbarComponent } from './pages/nav/navbar/navbar.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FeaturesComponent,
    IntegrationComponent,
    NavbarComponent,
    TimeComponent,
    LoginComponent,
    RegisterComponent,
    ProjectsComponent,
    ReportsComponent,
    ManageComponent,
    HelpComponent,
    ProfileComponent,
    SettingsComponent,
    LogoutComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule,
    NbLayoutModule,
    NbEvaIconsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
