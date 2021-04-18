import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ProjectService } from 'src/app/core/services/project.service';
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
    password: new FormControl(''),
    inviteCode: new FormControl('')
  });

  error: string;
  isLoading: boolean = false;
  discordLink: string;
  discordLinkResuts: string = "";

  constructor(
    private authService: AuthApiService,
    private JwtService: JwtService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private titleService: Title,
    private toastrService: NbToastrService,
  ) {
    this.titleService.setTitle("NTime - Login");
    }

  ngOnInit(): void {
    this.discordLink = this.activatedRoute.snapshot.queryParamMap.get('discordLink');
    this.loginForm.patchValue({
      inviteCode: this.activatedRoute.snapshot.queryParamMap.get('inviteCode')
    });
  }

  login(loginForm: any) {
    this.error = '';
    this.isLoading = true;
    if(!loginForm.email || !loginForm.password){
      this.error = "Please enter email and password.";
      this.isLoading = false;
      return;
    } 

    // Check to see if this is a login request or discord link request
    if(this.discordLink && this.discordLink.length > 0) {
      this.linkDiscordAccount(loginForm);
      return;
    }

    this.authService.login({ 
      email: loginForm.email, 
      password: loginForm.password,
      inviteCode: loginForm.inviteCode
    }).subscribe((response: GenericResponseDTO) => {
      if(response.success) {
        // Handle Successful Login
        this.JwtService.setTokens(response.data.accessToken, response.data.refreshToken);
  
        this.route.queryParamMap.subscribe(
          (paramMap) => {
            if(paramMap.get('returnUrl')){
              this.router.navigate([paramMap.get('returnUrl')]);
            }else{
              if(response.message == "Added User to Project"){
                this.toastrService.success("You have been added to a project", "Success");
              }else if(response.message == "Project not found"){
                this.toastrService.danger("Invite code is not valid", "Error")
              }else if (response.message == "Unable to add to Archived Project"){
                this.toastrService.danger("Unable to add user to Archived Project", "Error");
              }else if (response.message == "User already in project"){
                this.toastrService.danger("You are already apart of this project", "Error");
              }
              
              this.router.navigate(['/dashboard/profile']);
            }
          }
        )
        
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

  linkDiscordAccount(loginForm: any) {
    this.authService.link({ 
      email: loginForm.email, 
      password: loginForm.password,
      discordLink: this.discordLink
    }).subscribe((response: GenericResponseDTO) => {
      if(response.success) {
        if(response.data == true) {
          this.discordLinkResuts = "Your Discord account has been successfully linked with your NTime account."
        } else {
          this.discordLinkResuts = "Invalid Discord link url. Please try generating a new link with the !login command on Discord."
        }
      } else {
        this.error = response.message;
      }
      this.isLoading = false;
    }, () => {
      this.error = 'API Not Connected.';
      this.isLoading = false;
    });
  }

}
