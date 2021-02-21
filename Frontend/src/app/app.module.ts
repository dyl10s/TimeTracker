import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ProfileComponent } from './views/dashboard/profile/profile.component';

import { NbThemeModule, NbLayoutModule, NbButtonModule, NbSidebarModule, NbMenuModule, NbTabsetModule, NbRouteTabsetModule, NbInputModule, NbCardModule, NbIconModule, NbSpinnerModule, NbToastrModule, NbDialogService, NbButtonGroupModule } from '@nebular/theme';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { AuthGuard } from './core/guards/auth.guard';
import { TokenInterceptorService } from './core/services/auth/token-interceptor.service';
import { ProjectsComponent } from './views/dashboard/projects/projects.component';
import { CreateProjectComponent } from './views/dashboard/create-project/create-project.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';




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
    NavbarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
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
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NbButtonGroupModule,

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
    {
      provide: MatDialogRef,
      useValue: {}
    },
    NbDialogService
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateProjectComponent]
})
export class AppModule { }
