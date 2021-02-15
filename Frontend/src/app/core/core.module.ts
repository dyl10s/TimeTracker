import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryApiService } from './services/timeEntry.api.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NavbarComponent
  ],
  providers: [
    TimeEntryApiService
  ],
  exports: [
    NavbarComponent
  ]
})
export class CoreModule { }
