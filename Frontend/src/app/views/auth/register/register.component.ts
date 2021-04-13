import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { GenericResponseDTO } from '../../../core/models/GenericResponseDTO.model';
import { AuthApiService } from '../../../core/services/auth/auth-api.service';

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
    confirmPassword: new FormControl(''),
    inviteCode: new FormControl('')
  });

  error: string;
  isLoading: boolean = false;

  constructor(
    private authService: AuthApiService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private titleService: Title,
    private toastrService: NbToastrService,
  ) {
      this.titleService.setTitle("NTime - Register");
    }

  ngOnInit(): void {
    this.registerForm.patchValue({
      inviteCode: this.activatedRoute.snapshot.queryParamMap.get('inviteCode')
    });
  }

  register(registerForm: any) {
    this.error = '';
    this.isLoading = true;
    if(!registerForm.firstName || 
      !registerForm.lastName || 
      !registerForm.email || 
      !registerForm.password ||
      !registerForm.confirmPassword){
      this.error = "Please enter all fields.";
      this.isLoading = false;
      return;
    } 

    this.authService.register({ 
      email: registerForm.email, 
      password: registerForm.password, 
      firstName: registerForm.firstName.trim(),
      lastName: registerForm.lastName.trim(),
      inviteCode: registerForm.inviteCode
    }).subscribe((response: GenericResponseDTO) => {
      if(response.success) {
        // Handle Successful Registration
        if(response.message == "Added User to Project"){
          this.toastrService.success("You have been added to a project", "Success");
        }else if(response.message == "Project not found"){
          this.toastrService.danger("Invite code has not been found", "Error")
        }
        
        this.router.navigate(['/auth/login']);
      } else {
        this.error = response.message;
      }
      this.isLoading = false;
    }, (error: any) => {
      this.error = 'API Not Connected.';
      this.isLoading = false;
    });
  }

}
