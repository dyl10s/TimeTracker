import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { CreateTimeComponent } from 'src/app/shared/components/create-time/create-time.component';
import { EditTimeComponent } from 'src/app/shared/components/edit-time/edit-time.component';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent {
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
  monActive = false; tueActive = false; wedActive = false; thurActive = false;
  friActive = false; satActive = false; sunActive = false;
  // Variables to be set from db //
  timeSpent = '0:00';
  weekTimeSpent = '0:00'
  // Timer button icons //
  timerBtnIcon = 'play-circle-outline';
  timerBtnText = "Start"
  // Controls view //
  dayView: boolean = true;
  weekView: boolean = false;
  // Return button text //
  returnText: String = "Today";


  constructor(
    private dialogService: NbDialogService,
    private dateService: NbDateService<Date>
  ) {
    this.today = this.dateService.today();
    this.weekStartDate = this.weekStart;
    this.weekEndDate = this.weekEnd;

  }

  /* Increases date using arrow buttons */
  incDate() {
    this.updateDates();
    if (this.dayView) {
      this.today = this.dateService.addDay(this.today, 1);
    } else {
      this.weekStartDate = this.dateService.addDay(this.weekStartDate, 7)
      this.weekEndDate = this.dateService.addDay(this.weekEndDate, 7)
    }
  }

  /* Decreases date using arrow buttons */
  decDate() {
    this.updateDates();
    if (this.dayView) {
      this.today = this.dateService.addDay(this.today, -1);
    } else {
      this.weekStartDate = this.dateService.addDay(this.weekStartDate, -7)
      this.weekEndDate = this.dateService.addDay(this.weekEndDate, -7)
    }
  }

  /* Returns to date using return button */
  returnDate() {
    this.today = this.dateService.today();
    this.notDate = false;
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
    this.dialogService.open(CreateTimeComponent, {}).onClose.subscribe((x: any) => {
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
      this.timerBtnText = 'Stop'
      this.timerBtnIcon = 'stop-circle-outline'
    } else {
      this.timerBtnText = 'Start'
      this.timerBtnIcon = 'play-circle-outline';
    }
  }

  /* To be modified -- controls date views on button clicks */
  updateDates() {
    this.weekStartDate = this.weekStart;
    this.weekEndDate = this.weekEnd;

    this.weekDay = this.dateService.getDayOfWeek(this.today);
    if (this.today.valueOf() === this.dateService.today().valueOf()) {
      this.notDate = false;
    } else {
      this.notDate = true;
    }

    // Note: tried loop with array here to save space - wouldnt update variable //
    // if (this.weekDay == 1) {
    //   this.monActive = true;
    // }
    // if (this.weekDay == 2) {
    //   this.tueActive = true;
    // }
    // if (this.weekDay == 3) {
    //   this.wedActive = true;
    // }
    // if (this.weekDay == 4) {
    //   this.thurActive = true;
    // }
    // if (this.weekDay == 5) {
    //   this.friActive = true;
    // }
    // if (this.weekDay == 6) {
    //   this.satActive = true;
    // }
    // if (this.weekDay == 7) {
    //   this.sunActive = true;
    // }
  }

}