import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/core/services/auth/jwt.service';

@Component({
  selector: 'app-logout',
  template: '<p>Logging Out...</p>'
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private jwtService: JwtService
  ) { }

  ngOnInit() {
    this.jwtService.logout();
    this.router.navigate(['/auth/login'])
  }

}
