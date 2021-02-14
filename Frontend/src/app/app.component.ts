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
export class AppComponent {
  title: 'TimeTracker'
  
  // name: any;

  // constructor(
  //   private route: ActivatedRoute,
  // ) { }

  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     this.name = params['name'];
  //   });
  // }

  // results: TimeEntry[] = [];

  // testEntry: FormGroup = new FormGroup({
  //   message: new FormControl('')
  // });

  // constructor(private TimeEntry: TimeEntryApiService) {
  //   this.TimeEntry.getTimeEntry().subscribe((data: TimeEntry[]) => {
  //     this.results = data;
  //   })
  // }

  // submitForm(){
  //   var message = this.testEntry.controls['message'].value;

  //   if(message){
  //     this.TimeEntry.postTimeEntry({
  //         StartTime: new Date(new Date().setHours(new Date().getHours() - 1)),
  //         EndTime: new Date(),
  //         Message: message
  //     }).subscribe((data: TimeEntry) => {
  //       this.results.push(data);
  //       this.testEntry.reset();
  //     })
  //   }
  // }
}
