import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { GenericResponseDTO } from '../../../core/models/GenericResponseDTO.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  firstName: string;
  lastName: string;
  emailAddress: string;
  projects: string[] = [];
  passwordUpdateStatus: string;
  userInfoError: string;

  userInfoLoading: boolean = true;
  passwordInfoLoading: boolean = false;

  setPasswordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    newPasswordVerification: new FormControl('')
  });

  constructor(private profileService: ProfileService) {
    this.profileService.getProfileInfo().subscribe(
      (httpResponse: GenericResponseDTO) => {
        let tokens: string[] = httpResponse.data.name.split(" ", 2);
        this.firstName = tokens[0];
        this.lastName = tokens[1];
        this.emailAddress = httpResponse.data.email;
        this.projects = httpResponse.data.projects;
      },
      (error) => {
        this.passwordUpdateStatus = "Server error encountered (" + error + ")";
      },
      () => {
        this.userInfoLoading = false;
      }
    );
  }

  public setPassword(setPasswordForm: FormGroup) {
    if(setPasswordForm.get('newPassword').value === ""             ||
       setPasswordForm.get('newPasswordVerification').value === "" ||
       setPasswordForm.get('currentPassword').value === ""         )
    {
      this.passwordUpdateStatus = "All fields are required.";
    } else if(setPasswordForm.get('newPassword').value != setPasswordForm.get('newPasswordVerification').value) {
      this.passwordUpdateStatus = "New passwords do not match each other.";
    } else {
      this.passwordInfoLoading = true;
      this.profileService.setPassword(
      {
        currentPassword: setPasswordForm.get('currentPassword').value,
        newPassword: setPasswordForm.get('newPassword').value
      }
      ).subscribe(
        (response: GenericResponseDTO) => {
          if(response.success)
            this.passwordUpdateStatus = "Password was updated successfully.";
          else
            this.passwordUpdateStatus = response.message;
        },
        (error) => {
          this.passwordUpdateStatus = "Server error encountered (" + error + ")";
        },
        () => {
          this.passwordInfoLoading = false;
        }
      );
    }
  }

  ngOnInit(): void {
    
  }

}
