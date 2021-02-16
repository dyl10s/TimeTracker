import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntryApiService } from './services/timeEntry.api.service';
<<<<<<< HEAD
=======
import { NavbarComponent } from './components/navbar/navbar.component';
>>>>>>> 7ed565ae8cbce9bcb7c7b4e4fae8f83d97a596e9

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
<<<<<<< HEAD

  ],
  providers: [
    TimeEntryApiService
=======
    NavbarComponent
  ],
  providers: [
    TimeEntryApiService
  ],
  exports: [
    NavbarComponent
>>>>>>> 7ed565ae8cbce9bcb7c7b4e4fae8f83d97a596e9
  ]
})
export class CoreModule { }
