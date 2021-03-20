import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PayloadDTO } from '../../models/auth/PayloadDto.model';
import { GenericResponseDTO } from '../../models/GenericResponseDTO.model';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(
    public jwtHelper: JwtHelperService,
    private authApiService: AuthApiService
  ) {}

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

  public isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken');

    try {
      if(this.jwtHelper.isTokenExpired(accessToken)){
        this.authApiService.refresh({ email: this.decode().email, refreshToken: this.getRefreshToken() }).subscribe((response: GenericResponseDTO) => {
          if(response.success) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
          }else{
            return false;
          }
          return true;
        }, (err) => {
          return false;
        })
      } else {
        return true;
      }
    } catch {
      return false;
    }
  }

  public logout(){
    localStorage.clear();
  }
}
