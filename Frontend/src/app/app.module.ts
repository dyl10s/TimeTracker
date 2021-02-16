import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbButtonModule, NbSidebarModule, NbMenuModule, NbTabsetModule, NbRouteTabsetModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/components/navbar/navbar.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent    
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbMenuModule.forRoot(),
    NbTabsetModule,
    NbRouteTabsetModule

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
