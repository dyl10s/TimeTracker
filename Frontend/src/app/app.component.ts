import { Component } from '@angular/core';
import { TimeEntryApiService } from './core/services/timeEntry.api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  results;

  constructor(private TimeEntry: TimeEntryApiService) {
    this.results = this.TimeEntry.getTimeEntry();
  }
}
