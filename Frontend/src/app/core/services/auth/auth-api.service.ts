import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserDto } from '../../models/auth/UserDto.model';
import { RefreshDto } from '../../models/auth/RefreshDto.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  login(loginUser: UserDto) {
    return this.http.post(`${this.api}/Auth/Login`, loginUser);
  }

  register(registerUser: UserDto) {
    return this.http.post(`${this.api}/Auth/Register`, registerUser);
  }

  link(registerUser: UserDto) {
    return this.http.post(`${this.api}/Auth/Link`, registerUser);
  }

  refresh(refresh: RefreshDto) {
    return this.http.post(`${this.api}/Auth/Refresh`, refresh);
  }
}
