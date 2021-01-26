import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TimeEntryApiService {

    private api: string = environment.api;

    constructor(private http: HttpClient) { }

    getTimeEntry() {
        return this.http.get(`${this.api}/TimeEntry`);
    }
}
