import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericResponseDTO } from '../../../core/models/GenericResponseDTO.model';
import { AuthApiService } from '../../../core/services/auth/auth-api.service';
import { JwtService } from '../../../core/services/auth/jwt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  error: string;

  constructor(
    private authService: AuthApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  register(registerForm: any) {
    if(!registerForm.firstName || 
      !registerForm.lastName || 
      !registerForm.email || 
      !registerForm.password ||
      !registerForm.confirmPassword){
      this.error = "Please enter all fields.";
      return;
    } 

    this.authService.register({ 
      Email: registerForm.email, 
      Password: registerForm.password, 
      Name: `${registerForm.firstName.trim()} ${registerForm.lastName.trim()}` })
    .subscribe((response: GenericResponseDTO) => {
      if(response.success) {
        // Handle Successful Registration
        this.router.navigate(['/auth/login']);
      } else {
        this.error = response.message;
      }
    });
  }

}
