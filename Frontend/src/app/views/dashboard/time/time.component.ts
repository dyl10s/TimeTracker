import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NbDateService, NbDialogService, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { TimeEntryApiService } from 'src/app/core/services/timeEntry.api.service';
import { TimerService } from 'src/app/core/services/timer.service';
import { CreateTimeComponent } from 'src/app/shared/components/create-time/create-time.component';
import { EditTimeComponent } from 'src/app/shared/components/edit-time/edit-time.component';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  updateSubscription: Subscription;
  showLoadingSpinner: boolean = false;
  gridHeaders: string[] = ["ProjectName","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Total"];
  weekViewRows: TreeNode<any>[] = [];
  timeEntryDataSource: NbTreeGridDataSource<any>;
  totalHours: string = "0:00";
  editMode: boolean = false;

  // Date choosen  //
  today: Date;
  // Date range based on date chosen //
  weekStartDate: Date;
  weekEndDate: Date;
  // Boolean for return to date //
  notDate: boolean = false;
  // Controls active day //
  weekDay: number;
  daysActive: boolean[] = [false, false, false, false, false, false, false];
  // Variables to be set from db //
  timeSpent = '0:00';
  weekTimeSpent = '0:00'
  // Timer button icons //
  timerBtnIcon = 'stop-circle-outline';
  timerBtnText = 'Stop';
  timerBtnStatus = 'danger';
  // Controls view //
  dayView: boolean = true;
  weekView: boolean = false;
  // Return button text //
  returnText: string = 'Today';
  // Week view button dates //
  monDate: Date; tueDate: Date; wedDate: Date; thurDate: Date; friDate: Date; satDate: Date; sunDate: Date;

  allEvents: any = [];
  displayEvents: any = [];

  allTimers: any = [];
  displayTimers: any = [];

  allProjects: any = [];

  constructor(
    private dialogService: NbDialogService,
    private dateService: NbDateService<Date>,
    private timeEntryService: TimeEntryApiService,
    private timerService: TimerService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private toastrService: NbToastrService,
    private titleService: Title,
  ) {
    this.titleService.setTitle("NTime - Time Tracker");
    this.today = this.dateService.today();
    this.weekStartDate = this.weekStart;
    this.weekEndDate = this.weekEnd;

    this.timeEntryDataSource = this.dataSourceBuilder.create(this.weekViewRows);
  }

  /* Refresh variables */
  ngOnInit() {
    this.updateSubscription = interval(100).subscribe(
      (val) => {
        this.updateDates()
      }
    );

    this.updateInformation();
  }

  /* Increases date using arrow buttons */
  incDate() {
    if (this.dayView) {
      this.today = this.dateService.addDay(this.today, 1);
    } else {
      this.today = this.dateService.addDay(this.weekStartDate, 7);
      this.weekStartDate = this.dateService.addDay(this.weekStartDate, 7)
      this.weekEndDate = this.dateService.addDay(this.weekEndDate, 7)
    }

    this.switchedDate();
  }

  /* Decreases date using arrow buttons */
  decDate() {
    if (this.dayView) {
      this.today = this.dateService.addDay(this.today, -1);
    } else {
      this.today = this.dateService.addDay(this.weekStartDate, -7);
      this.weekStartDate = this.dateService.addDay(this.weekStartDate, -7)
      this.weekEndDate = this.dateService.addDay(this.weekEndDate, -7)
    }

    this.switchedDate();
  }

  switchedDate() {
    this.displayEvents = this.allEvents.filter(x => this.setTime(new Date(x.day)).toISOString() == this.setTime(new Date(this.today)).toISOString());
    this.displayTimers = this.allTimers.filter(x => this.setTime(new Date(x.startTime)).toISOString() === this.setTime(new Date(this.today)).toISOString());
    this.updateWeekView();
  }

  setTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }

  /* Returns to date using return button */
  returnDate() {
    this.today = this.dateService.today();
    this.notDate = false;
    this.switchedDate();
  }

  /* Returns to day view from week -day button click */
  returnDayView(number) {
    switch (number) {
      case 1:
        this.setDayView();
        this.today = this.monDate;
        break;
      case 2:
        this.setDayView();
        this.today = this.tueDate;
        break;
      case 3:
        this.setDayView();
        this.today = this.wedDate;
        break;
      case 4:
        this.setDayView();
        this.today = this.thurDate;
        break;
      case 5:
        this.setDayView();
        this.today = this.friDate;
        break;
      case 6:
        this.setDayView();
        this.today = this.satDate;
        break;
      case 0:
        this.setDayView();
        this.today = this.sunDate;
        break;
      default:
        console.log("Error");
        break;
    }

    this.switchedDate();
  }

  /* Updates screen for day view button click */
  setDayView() {
    this.dayView = true;
    this.weekView = false;
    this.returnText = "Today";
    this.today = this.dateService.today();
    this.switchedDate();
  }

  /* Updates screen for week view button click */
  setWeekView() {
    this.weekView = true;
    this.dayView = false;
    this.returnText = "Week";
    this.today = this.dateService.today();
    this.switchedDate();
  }

  /* Method to get calendar week start date */
  get weekStart(): Date {
    switch (this.dateService.getDayOfWeek(this.today)) {
      case 1:
        return this.dateService.addDay(this.today, 0);
      case 2:
        return this.dateService.addDay(this.today, -1);
      case 3:
        return this.dateService.addDay(this.today, -2);
      case 4:
        return this.dateService.addDay(this.today, -3);
      case 5:
        return this.dateService.addDay(this.today, -4);
      case 6:
        return this.dateService.addDay(this.today, -5);
      case 0:
        return this.dateService.addDay(this.today, -6);
      default:
        console.log("Error");
        break;
    }
  }

  /* Method to get calendar week end date */
  get weekEnd(): Date {
    switch (this.dateService.getDayOfWeek(this.today)) {
      case 1:
        return this.dateService.addDay(this.today, 6);
      case 2:
        return this.dateService.addDay(this.today, 5);
      case 3:
        return this.dateService.addDay(this.today, 4);
      case 4:
        return this.dateService.addDay(this.today, 3);
      case 5:
        return this.dateService.addDay(this.today, 2);
      case 6:
        return this.dateService.addDay(this.today, 1);
      case 0:
        return this.dateService.addDay(this.today, 0);
      default:
        console.log("Error");
        break;
    }
  }

  /* Method to open create time entry screen */
  openCreateNewTimeEntry() {
    this.dialogService.open(CreateTimeComponent, {
      context: {
        day: this.today
      }
    }).onClose.subscribe((x: any) => {
      if(x){
        if(x.update){
          this.updateInformation();
        }
      }
    })
  }

  /* Method to open edit time entry screen */
  openEditTimeEntry(event: any) {
    this.dialogService.open(EditTimeComponent, {
      context: {
        event: event
      }
    }).onClose.subscribe((x: any) => {
      console.log(x)
      // Clicking outside of dialog will not pass
      if (x) {
        // Clicking cancel will not pass
        if (x.update) {
          this.toastrService.show("Time entry updated", 'Success', {status:'success', duration: 5000});
          this.allEvents = null;
          this.updateInformation();
        }
      }
    });
  }

  updateInformation() {
    this.updateDates();
    this.timeEntryService.getTimeEntry(this.weekStartDate, this.weekEndDate).subscribe((response: GenericResponseDTO) => {
      this.allEvents = response.data;
      this.displayEvents = this.allEvents.filter(x => this.setTime(new Date(x.day)).toISOString() === this.setTime(new Date()).toISOString());
      this.weekTimeSpent = this.allEvents.map(x => x.length).reduce((a, b) => { return a + b }, 0);
      this.updateWeekView();
    })

    this.timerService.getTimerFromDateRange(this.weekStartDate, this.weekEndDate).subscribe((response: GenericResponseDTO) => {
      this.allTimers = response.data;
      this.displayTimers = this.allTimers.filter(x => this.setTime(new Date(x.startTime)).toISOString() === this.setTime(new Date()).toISOString());
    })
  }

  updateWeekView(){
    this.weekViewRows = [];
    this.allEvents.map(x => x.project.name).filter((item, i, ar) => ar.indexOf(item) === i).forEach(e => {
      this.weekViewRows.push({
        data: {
          projectName: e,
          mon: this.countHours(this.monDate, e),
          tue: this.countHours(this.tueDate, e),
          wed: this.countHours(this.wedDate, e),
          thu: this.countHours(this.thurDate, e),
          fri: this.countHours(this.friDate, e),
          sat: this.countHours(this.satDate, e),
          sun: this.countHours(this.sunDate, e),
          totalHours: 70
        },
        children: [],
        expanded: false
      })
    });

    this.timeEntryDataSource = this.dataSourceBuilder.create(this.weekViewRows);
  }

  countHours(date, projectName){
    if(this.allEvents.filter(x => this.setTime(new Date(x.day)).toISOString() == this.setTime(new Date(date)).toISOString() && x.project.name == projectName).length > 0){
      return this.allEvents.filter(x => this.setTime(new Date(x.day)).toISOString() == this.setTime(new Date(date)).toISOString() && x.project.name == projectName).map(x => x.length).reduce((a, b) => a + b)
    }else{
      return 0
    }
  }

  /* Method to update timer button view */
  startStopTimer(timer) {
    this.timerService.stopTimer(timer.id).subscribe((response) => {
      console.log(response)
      this.updateInformation();
    })
  }

  /* To be modified -- controls date views on button clicks */
  updateDates() {
    this.weekDay = this.dateService.getDayOfWeek(this.today);
    if (this.today.setHours(0, 0, 0, 0).valueOf() === this.dateService.today().setHours(0, 0, 0, 0).valueOf()) {
      this.notDate = false;
    } else {
      this.notDate = true;
    }

    this.weekStartDate = this.weekStart;
    this.weekEndDate = this.weekEnd;
    this.monDate = this.weekStartDate;
    this.tueDate = this.dateService.addDay(this.weekStartDate, 1);
    this.wedDate = this.dateService.addDay(this.weekStartDate, 2);
    this.thurDate = this.dateService.addDay(this.weekStartDate, 3);
    this.friDate = this.dateService.addDay(this.weekStartDate, 4);
    this.satDate = this.dateService.addDay(this.weekStartDate, 5);
    this.sunDate = this.dateService.addDay(this.weekStartDate, 6);

    for (let i = 0; i < 8; i++) {
      if (this.weekDay == i) {
        this.daysActive[i] = true;
      } else {
        this.daysActive[i] = false;
      }
    }
  }

}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}