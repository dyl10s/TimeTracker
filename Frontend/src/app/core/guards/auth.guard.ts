import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../services/auth/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private jwtService: JwtService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = next.data.isAuth || false;

    if(isAuth && !this.jwtService.isAuthenticated()){
      // is not logged in
      return true;
    }

    if(isAuth && this.jwtService.isAuthenticated()){
      // logged in true and isAuth
      this.router.navigate(['/']);
      return false;
    }
    
    if (this.jwtService.isAuthenticated()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
}
