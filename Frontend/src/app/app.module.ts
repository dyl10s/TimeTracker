import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ProfileComponent } from './views/dashboard/profile/profile.component';

import { NbThemeModule, NbLayoutModule, NbButtonModule, NbSidebarModule, NbMenuModule, NbTabsetModule, NbRouteTabsetModule, NbInputModule, NbCardModule, NbIconModule, NbSpinnerModule, NbToastrModule, NbDialogService, NbButtonGroupModule, NbTreeGridModule, NbDialogModule, NbSelectModule, NbDatepickerModule, NbDatepickerAdapter, NbPopoverModule, NbCalendarModule } from '@nebular/theme';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { AuthGuard } from './core/guards/auth.guard';
import { TokenInterceptorService } from './core/services/auth/token-interceptor.service';
import { ProjectsComponent } from './views/dashboard/projects/projects.component';
import { CreateProjectComponent } from './shared/components/create-project/create-project.component';
import { TimeComponent } from './views/dashboard/time/time.component';
import { CreateTimeComponent } from './shared/components/create-time/create-time.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CreateProjectComponent,
    ProjectsComponent,
    ProfileComponent,
    NavbarComponent,
    TimeComponent,
    CreateTimeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbDialogModule.forRoot(),
    NbTreeGridModule,
    NbIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbMenuModule.forRoot(),
    NbTabsetModule,
    NbRouteTabsetModule,
    NbInputModule,
    NbCardModule,
    NbButtonGroupModule,
    NbSelectModule,
    NbDatepickerModule.forRoot(),
    NbPopoverModule,
    NbCalendarModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    NbSpinnerModule,
    NbToastrModule.forRoot({
      duration: 7500,
      destroyByClick: true
    })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    NbDialogService
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateProjectComponent, CreateTimeComponent]
})
export class AppModule { }
