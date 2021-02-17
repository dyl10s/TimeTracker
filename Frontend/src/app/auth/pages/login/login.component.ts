import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(
    private authService: AuthApiService,
    private JwtService: JwtService
  ) { }

  ngOnInit(): void {
  }

  login(loginForm: any) {
    if(!loginForm.email || !loginForm.password){
      this.error = "Please enter email and password.";
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
        alert(`You have been logged in as ${this.JwtService.decode().given_name}!`);
      } else {
        this.loginForm.controls['password'].reset();
        this.error = response.message;
      }
    });
  }

}
