import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileDTO } from '../models/ProfileDTO.model';
import { GenericResponseDTO } from '../models/GenericResponseDTO.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  public getProfileInfo() {
    return this.http.get(`${this.api}/Profile`);
  }

}
