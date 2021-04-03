import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { PayloadDTO } from '../../models/auth/PayloadDto.model';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(public jwtHelper: JwtHelperService, private authService: AuthApiService) {}

  public setTokens(jwt: string, refresh: string) {
    localStorage.setItem('accessToken', jwt);
    localStorage.setItem('refreshToken', refresh);
  }

  public decode(): PayloadDTO {
    try{
      return this.jwtHelper.decodeToken(localStorage.getItem('accessToken'));
    } catch {
      return null;
    }
  }

  public getJWT(){
    return localStorage.getItem('accessToken');
  }

  public getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  public refreshToken() : Observable<any> {
    return this.authService.refresh({
      email: this.decode().email,
      refreshToken: this.getRefreshToken()
    });
  }

  public isExpired() {
    let jwt = this.getJWT();
    if(jwt) {
      return this.jwtHelper.isTokenExpired(this.getJWT());
    }else{
      return false;
    }
  }

  public isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken');

    try {
      return !this.jwtHelper.isTokenExpired(accessToken);
    } catch {
      return false;
    }
  }

  public logout(){
    localStorage.clear();
  }
}
