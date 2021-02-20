import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PasswordChangeDTO } from '../models/PasswordChangeDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  public getProfileInfo() {
    return this.http.get(`${this.api}/Profile`);
  }

  public setPassword(updatePasswordInfo: PasswordChangeDTO) {
    return this.http.post(`${this.api}/SetPassword`, updatePasswordInfo);
  }

}
