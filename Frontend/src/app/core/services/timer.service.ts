import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  startTimer(notes: string, projectId: number){
    return this.http.post(`${this.api}/Timer/Start`, { notes, projectId });
  }

  stopTimer(timerId: number){
    return this.http.post(`${this.api}/Timer/Stop`, { timerId });
  }

  getTimer(timerId: number){
    return this.http.post(`${this.api}/Timer`, { timerId });
  }

  getAllTimers(){
    return this.http.get(`${this.api}/Timer`);
  }

  getTimerFromDateRange(startDate: Date, endDate: Date) {
    return this.http.get(`${this.api}/Timer/DateRange`, { params: { startDate: startDate.toDateString(), endDate: endDate.toDateString() } });
  }

}
