import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TimeEntry } from '../models/TimeEntry.model';
 
@Injectable({
    providedIn: 'root'
})
export class TimeEntryApiService {

    private api: string = environment.api;

    constructor(private http: HttpClient) { }

    getTimeEntry(startDate: Date, endDate: Date) {
        return this.http.get(`${this.api}/TimeEntry?startDate=${encodeURIComponent(startDate.toDateString())}&endDate=${encodeURIComponent(endDate.toDateString())}`);
    }

    postTimeEntry(timeEntry: TimeEntry) {
        return this.http.post(`${this.api}/TimeEntry`, timeEntry);
    }

}
