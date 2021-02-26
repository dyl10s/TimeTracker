import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { CreateTimeComponent } from 'src/app/shared/components/create-time/create-time.component';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent {

  showLoadingSpinner: boolean = false;
  today: Date;
  notToday: Boolean = false;
  weekDay: number;
  timeSpent = '0:00';
  weekTimeSpent = '0:00'
  selectedOption = '0';
  timerBtnIcon = 'play-circle-outline';
  timerBtnText = "Start"
  monActive = false; tueActive = false; wedActive = false; thurActive = false;
  friActive = false; satActive = false; sunActive = false;

  constructor(
    private dialogService: NbDialogService,
    private dateService: NbDateService<Date>
  ) {
    this.today = this.dateService.today();
    this.weekDay = this.dateService.getDayOfWeek(this.today);
  }

  incDate() {
    this.today = this.dateService.addDay(this.today, 1);
    this.updateDates();
  }

  decDate() {
    this.today = this.dateService.addDay(this.today, -1);
    this.updateDates();
  }

  returnToday() {
    this.today = this.dateService.today();
    this.notToday = false;
  }

  openCreateNewTimeEntry() {
    this.dialogService.open(CreateTimeComponent, {}).onClose.subscribe((x: any) => {
    });
  }

  startStopTimer() {
    if (this.timerBtnText == 'Start') {
      this.timerBtnText = 'Stop'
      this.timerBtnIcon = 'stop-circle-outline'
    } else {
      this.timerBtnText = 'Start'
      this.timerBtnIcon = 'play-circle-outline';
    }
  }

  updateDates() {
    if (this.today.valueOf() === this.dateService.today().valueOf()) {
      this.notToday = false;
    } else {
      this.notToday = true;
    }

    // Note: tried loop with array here to save space - wouldnt update variable //
    if (this.weekDay == 1) {
      this.monActive = true;
    }
    if (this.weekDay == 2) {
      this.tueActive = true;
    }
    if (this.weekDay == 3) {
      this.wedActive = true;
    }
    if (this.weekDay == 4) {
      this.thurActive = true;
    }
    if (this.weekDay == 5) {
      this.friActive = true;
    }
    if (this.weekDay == 6) {
      this.satActive = true;
    }
    if (this.weekDay == 7) {
      this.sunActive = true;
    }
  }

  activateDayButton() { }
  editTimer() { }

}