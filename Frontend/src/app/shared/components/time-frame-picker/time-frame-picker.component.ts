import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-time-frame-picker',
  templateUrl: './time-frame-picker.component.html',
  styleUrls: ['./time-frame-picker.component.scss']
})
export class TimeFramePickerComponent {

  @Input() startDate: Date;
  @Output() startDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Input() endDate: Date;
  @Output() endDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Output() datesChanged = new EventEmitter();

  timeframe: string = "weekly";

  constructor() {
    // Default to the current week
    this.startDate = new Date();
    this.selectCurrentWeek(this.startDate);

    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.datesChanged.emit(null);
  }

  timeFrameChanged(e: string) {
    this.startDate = new Date();
    switch (e) {
      case "weekly":
        this.selectCurrentWeek(this.startDate);
        break;
      case "bi-weekly":
        this.selectCurrentBiWeek(this.startDate);
        break;
      case "monthly":
        this.selectCurrentMonth(this.startDate);
        break;
      case "yearly":
        this.selectCurrentYear(this.startDate);
        break;
      case "alltime":
        this.selectAllTime();
        break;
    }
    
    this.timeframe = e;
    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.datesChanged.emit(null);
  }

  startDateChanged(e: Date) {
    switch (this.timeframe) {
      case "weekly":
        this.startDate = e;
        this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 6);
        break;
      case "bi-weekly":
        this.startDate = e;
        this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 13);
        break;
      case "monthly":
        this.startDate = e;
        this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, this.startDate.getDate());
        break;
      case "yearly":
        this.startDate = e;
        this.endDate = new Date(this.startDate.getFullYear() + 1, this.startDate.getMonth(), this.startDate.getDate());
        break;
      default:
        this.startDate = e;
        if(this.startDate > this.endDate) {
          this.endDate = this.startDate;
        }
    }

    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.datesChanged.emit(null);
  }

  endDateChanged(e: Date) {
    switch (this.timeframe) {
      case "weekly":
        this.endDate = e;
        this.startDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate() - 6);
        break;
      case "bi-weekly":
        this.endDate = e;
        this.startDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate() - 13);
        break;
      case "monthly":
        this.endDate = e;
        this.startDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth() - 1, this.endDate.getDate());
        break;
      case "yearly":
        this.endDate = e;
        this.startDate = new Date(this.endDate.getFullYear() - 1, this.endDate.getMonth(), this.endDate.getDate());
        break;
      default:
        this.endDate = e;
        if(this.startDate > this.endDate) {
          this.startDate = this.endDate;
        }
    }

    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.datesChanged.emit(null);
  }

  rightButton() {
    switch (this.timeframe) {
      case "weekly":
        this.startDate.setDate(this.startDate.getDate() + 7);
        this.selectCurrentWeek(this.startDate);
        break;
      case "bi-weekly":
        this.startDate.setDate(this.startDate.getDate() + 14);
        this.selectCurrentBiWeek(this.startDate);
        break;
      case "monthly":
        this.startDate.setMonth(this.startDate.getMonth() + 1);
        this.selectCurrentMonth(this.startDate);
        break;
      case "yearly":
        this.startDate.setFullYear(this.startDate.getFullYear() + 1);
        this.selectCurrentYear(this.startDate);
        break;
      case "alltime":
        this.selectAllTime();
        break;
      case "custom":
        this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 1);
        this.endDate = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate() + 1);
    }

    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.datesChanged.emit(null);
  }

  leftButton() {
    switch (this.timeframe) {
      case "weekly":
        this.startDate.setDate(this.startDate.getDate() - 7);
        this.selectCurrentWeek(this.startDate);
        break;
      case "bi-weekly":
        this.startDate.setDate(this.startDate.getDate() - 14);
        this.selectCurrentBiWeek(this.startDate);
        break;
      case "monthly":
        this.startDate.setMonth(this.startDate.getMonth() - 1);
        this.selectCurrentMonth(this.startDate);
        break;
      case "yearly":
        this.startDate.setFullYear(this.startDate.getFullYear() - 1);
        this.selectCurrentYear(this.startDate);
        break;
      case "alltime":
        this.selectAllTime();
        break;
      case "custom":
    }

    this.startDateChange.emit(this.startDate);
    this.endDateChange.emit(this.endDate);
    this.datesChanged.emit(null);
  }

  selectCurrentWeek(referenceDate: Date) {
    this.startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    this.startDate.setDate(this.startDate.getDate() - this.startDate.getDay() + 1); // Monday
    this.endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    this.endDate.setDate(this.endDate.getDate() - this.endDate.getDay() + 7); // Sunday
  }

  selectCurrentBiWeek(referenceDate: Date) {
    this.startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    this.startDate.setDate(this.startDate.getDate() - this.startDate.getDay() + 1 - 7); // Last Monday
    this.endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    this.endDate.setDate(this.endDate.getDate() - this.endDate.getDay() + 7); // Sunday
  }

  selectCurrentMonth(referenceDate: Date) {
    this.startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    this.endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
    this.endDate.setDate(this.endDate.getDate() - 1);
  }

  selectCurrentYear(referenceDate: Date) {
    this.startDate = new Date(referenceDate.getFullYear(), 0, 1);
    this.endDate = new Date(referenceDate.getFullYear() + 1, 0, 1);
    this.endDate.setDate(this.endDate.getDate() - 1);
  }

  selectAllTime() {
    this.startDate = new Date("01/01/1900");
    this.endDate = new Date("01/01/2100");
  }

}
