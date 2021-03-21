import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { GenericResponseDTO } from '../models/GenericResponseDTO.model';
import { AuthApiService } from '../services/auth/auth-api.service';
import { JwtService } from '../services/auth/jwt.service';
import { ProjectService } from '../services/project.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private jwtService: JwtService,
    private projectService: ProjectService,
    private toastrService: NbToastrService,
    private authApiService: AuthApiService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = next.data.isAuth || false;

    if(isAuth && !this.jwtService.isAuthenticated()){
      // is not logged in
      return true;
    }

    if(isAuth && this.jwtService.isAuthenticated()){
      // logged in true and isAuth
      if(next.queryParams.inviteCode){
        this.projectService.addUserToProject(next.queryParams.inviteCode).subscribe((response: GenericResponseDTO) => {
          this.toastrService.success("You have been added to a project", "Success")
          this.router.navigate(['/dashboard/profile']);
          return false;
        })
      }
    }
    
    if (this.jwtService.isAuthenticated()) {
      // logged in so return true
      return true;
    }

    if (this.jwtService.isExpiredToken()) {
      this.authApiService.refresh({ email: this.jwtService.decode().email, refreshToken: this.jwtService.getRefreshToken() }).subscribe((response: GenericResponseDTO) => {
        this.jwtService.setTokens(response.data.accessToken, response.data.refreshToken);
        return true;
      })
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
}
