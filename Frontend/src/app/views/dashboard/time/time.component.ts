import { Component, OnInit } from '@angular/core';
import { NbDateService, NbDialogService, NbToastrService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
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
  timerBtnIcon = 'play-circle-outline';
  timerBtnText = 'Start';
  timerBtnStatus = 'primary';
  // Controls view //
  dayView: boolean = true;
  weekView: boolean = false;
  // Return button text //
  returnText: string = 'Today';
  // Week view button dates //
  monDate: Date; tueDate: Date; wedDate: Date; thurDate: Date; friDate: Date; satDate: Date; sunDate: Date;

  constructor(
    private dialogService: NbDialogService,
    private dateService: NbDateService<Date>,
    private toastrService: NbToastrService
  ) {
    this.today = this.dateService.today();
    this.weekStartDate = this.weekStart;
    this.weekEndDate = this.weekEnd;
  }

  /* Refresh variables */
  ngOnInit() {
    this.updateSubscription = interval(100).subscribe(
      (val) => {
        this.updateDates()
      }
    );
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
  }

  /* Returns to date using return button */
  returnDate() {
    this.today = this.dateService.today();
    this.notDate = false;
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
  }

  /* Updates screen for day view button click */
  setDayView() {
    this.dayView = true;
    this.weekView = false;
    this.returnText = "Today";
    this.today = this.dateService.today();
  }

  /* Updates screen for week view button click */
  setWeekView() {
    this.weekView = true;
    this.dayView = false;
    this.returnText = "Week";
    this.today = this.dateService.today();
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
    });
  }

  /* Method to open edit time entry screen */
  openEditTimeEntry() {
    this.dialogService.open(EditTimeComponent, {}).onClose.subscribe((x: any) => {
    });
  }

  /* Method to update timer button view */
  startStopTimer() {
    if (this.timerBtnText == 'Start') {
      this.timerBtnText = 'Stop';
      this.timerBtnIcon = 'stop-circle-outline';
      this.timerBtnStatus = 'danger';
    } else {
      this.timerBtnText = 'Start';
      this.timerBtnIcon = 'play-circle-outline';
      this.timerBtnStatus = 'primary';
    }
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