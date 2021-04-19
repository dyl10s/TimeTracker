import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericResponseDTO } from '../models/GenericResponseDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  getDetailsReport(projectId: number, startDate: Date, endDate: Date){
    return this.http.get<GenericResponseDTO<any>>(`${this.api}/Report/Details`, { 
        params: { 
            projectId: projectId.toString(),
            startDate: startDate.toDateString(), 
            endDate: endDate.toDateString() 
        } 
    });
  }

  getLengthReport(projectId: number, startDate: Date, endDate: Date){
    return this.http.get<GenericResponseDTO<any>>(`${this.api}/Report/Length`, { 
        params: { 
            projectId: projectId.toString(),
            startDate: startDate.toDateString(), 
            endDate: endDate.toDateString() 
        } 
    });
  }

  getLengthsReport(projectIds: number[], startDate: Date, endDate: Date){
    return this.http.get<GenericResponseDTO<any>>(`${this.api}/Report/Lengths`, { 
        params: {
            startDate: startDate.toDateString(), 
            endDate: endDate.toDateString(),
            projectIds: projectIds.map(x => x.toString())
        } 
    });
  }
}
