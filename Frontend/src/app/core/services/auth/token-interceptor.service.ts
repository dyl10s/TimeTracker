import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(public jwtService: JwtService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Don't intercept the auth requests
    if(request.headers.has('skipJWT')) {
      return next.handle(request);
    }

    if (this.jwtService.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.jwtService.getJWT()}`
        }
      });
      return next.handle(request);
    } 
    else if (this.jwtService.isExpired()) 
    {
      return this.jwtService.refreshToken().pipe(switchMap((res) => {

        if(res.success == true) {
          this.jwtService.setTokens(res.data.accessToken, res.data.refreshToken);

          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.jwtService.getJWT()}`
            }
          });
        }
        return next.handle(request);
      }));
    } 
    else 
    {
      return next.handle(request);
    }

  }
}
