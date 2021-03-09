import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  getDetailsReport(projectId: number, startDate: Date, endDate: Date){
    return this.http.get(`${this.api}/Report/Details`, { 
        params: { 
            projectId: projectId.toString(),
            startDate: startDate.toDateString(), 
            endDate: endDate.toDateString() 
        } 
    });
  }

  getLengthReport(projectId: number, startDate: Date, endDate: Date){
    return this.http.get(`${this.api}/Report/Length`, { 
        params: { 
            projectId: projectId.toString(),
            startDate: startDate.toDateString(), 
            endDate: endDate.toDateString() 
        } 
    });
  }
}
