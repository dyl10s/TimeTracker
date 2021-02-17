import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(public jwtHelper: JwtHelperService) {}

  public setTokens(jwt: string, refresh: string) {
    localStorage.setItem('accessToken', jwt);
    localStorage.setItem('refreshToken', refresh);
  }

  public decode(){
    try{
      return this.jwtHelper.decodeToken(localStorage.getItem('accessToken'));
    } catch {
      return null;
    }
  }

  public getJWT(){
    return localStorage.getItem('accessToken');
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
