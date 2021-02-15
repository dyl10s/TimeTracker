import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TimeEntry } from './core/models/TimeEntry.model';
import { TimeEntryApiService } from './core/services/timeEntry.api.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { }
