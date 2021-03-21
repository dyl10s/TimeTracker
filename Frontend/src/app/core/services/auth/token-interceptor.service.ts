import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';
import { GenericResponseDTO } from '../../models/GenericResponseDTO.model';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    public jwtService: JwtService,
    private authApiService: AuthApiService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

    if (this.jwtService.isAuthenticated() && !this.jwtService.isExpiredToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.jwtService.getJWT()}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError( response => {
        if(response.status === 401) {
          this.authApiService.refresh({ email: this.jwtService.decode().email, refreshToken: this.jwtService.getRefreshToken() }).subscribe((response: GenericResponseDTO) => {
            this.jwtService.setTokens(response.data.accessToken, response.data.refreshToken);
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.jwtService.getJWT()}`
              }
            });
            window.location.reload();
            return next.handle(request);
          })
        }
        return throwError(response);
      })
     )
    }

}
