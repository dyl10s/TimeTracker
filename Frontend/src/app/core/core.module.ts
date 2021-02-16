import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryApiService } from './services/timeEntry.api.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [

  ],
  providers: [
    TimeEntryApiService
  ]
})
export class CoreModule { }
