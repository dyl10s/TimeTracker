import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericResponseDTO } from '../../../core/models/GenericResponseDTO.model';
import { AuthApiService } from '../../../core/services/auth/auth-api.service';
import { JwtService } from '../../../core/services/auth/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  error: string;
  isLoading: boolean = false;

  constructor(
    private authService: AuthApiService,
    private JwtService: JwtService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(loginForm: any) {
    this.error = '';
    this.isLoading = true;
    if(!loginForm.email || !loginForm.password){
      this.error = "Please enter email and password.";
      this.isLoading = false;
      return;
    } 

    this.authService.login({ 
      Email: loginForm.email, 
      Password: loginForm.password })
    .subscribe((response: GenericResponseDTO) => {
      if(response.success) {
        // Handle Successful Login
        this.JwtService.setTokens(response.data.accessToken, response.data.refreshToken);
  
        // TODO: Remove alert and route to dashboard
        this.router.navigate(['/dashboard/profile']);
      } else {
        this.loginForm.controls['password'].reset();
        this.error = response.message;
      }
      this.isLoading = false;
    }, (error: any) => {
      this.error = 'API Not Connected.';
      this.isLoading = false;
    });
  }

}
