import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { GenericResponseDTO } from '../../../core/models/GenericResponseDTO.model';
import { NbToastrService } from '@nebular/theme';

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
  userInfoStatus: string;

  disableNameSubmitButton: boolean = true;
  disablePasswordSubmitButton: boolean = false;
  projectsLoading = true;

  setPasswordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    newPasswordVerification: new FormControl('')
  });

  updateNameForm: FormGroup = new FormGroup({
    firstName: new FormControl({value: '', disabled: true}),
    lastName: new FormControl({value: '', disabled: true}),
    email: new FormControl({value: '', disabled: true})
  });

  constructor(private profileService: ProfileService, private toastrService: NbToastrService) {
    this.profileService.getProfileInfo().subscribe(
      (httpResponse: GenericResponseDTO) => {
        let tokens: string[] = httpResponse.data.name.split(' ', 2);
        this.updateNameForm.get('firstName').setValue(tokens[0]);
        this.updateNameForm.get('lastName').setValue(tokens[1]);
        this.emailAddress = httpResponse.data.email;
        this.projects = httpResponse.data.projects;
      },
      (error) => {
        this.toastrService.show(error.message, 'Server error encountered.', {status:'warning'});
      },
      () => {
        this.updateNameForm.get('firstName').enable();
        this.updateNameForm.get('lastName').enable();
        this.disableNameSubmitButton = false;
        this.projectsLoading = false;
      }
    );
  }

  public setPassword(setPasswordForm: FormGroup) {
    if(setPasswordForm.get('newPassword').value === ''             ||
       setPasswordForm.get('newPasswordVerification').value === '' ||
       setPasswordForm.get('currentPassword').value === ''         )
    {
      this.toastrService.show('', 'All password fields are required.', {status:'danger'});
    }
    else if(setPasswordForm.get('newPassword').value != setPasswordForm.get('newPasswordVerification').value) {
      this.toastrService.show('', 'New passwords do not match each other.', {status:'danger'});
    }
    else {
      setPasswordForm.disable();
      this.disablePasswordSubmitButton = true;
      this.profileService.setPassword(
      {
        currentPassword: setPasswordForm.get('currentPassword').value,
        newPassword: setPasswordForm.get('newPassword').value
      }
      ).subscribe(
        (response: GenericResponseDTO) => {
          if(response.success)
            this.toastrService.show('', 'Password was updated successfully.', {status:'success'});
          else
            this.toastrService.show('', response.message, {status:'danger'});
        },
        (error) => {
          this.toastrService.show(error.message, 'Server error encountered.', {status:'warning'});
        },
        () => {
          setPasswordForm.enable();
          this.disablePasswordSubmitButton = false;
        }
      );
    }
  }

  public setName(updateNameForm: FormGroup) {
    if(updateNameForm.get('firstName').value === '' || 
       updateNameForm.get('lastName').value === ''  )
    {
      this.toastrService.show('', 'Both a first and last name are required.', {status:'danger'});
    }
    else{
      updateNameForm.get('firstName').disable();
      updateNameForm.get('lastName').disable();
      this.disableNameSubmitButton = true;
      this.profileService.setName({
        firstName: this.updateNameForm.get('firstName').value,
        lastName: this.updateNameForm.get('lastName').value
      }).subscribe(
        (response: GenericResponseDTO) => {
          if(response.success)
            this.toastrService.show('', 'Name updated successfully.', {status:'success'});
          else 
            this.toastrService.show('' , response.message, {status:'warning'});
        },
        (error) => {
          this.toastrService.show(error.message, 'Server error encountered.', {status:'warning'});
        },
        () => {
          updateNameForm.get('firstName').enable();
          updateNameForm.get('lastName').enable();
          this.disableNameSubmitButton = false;
        }
      )
    }
  }

  ngOnInit(): void {
    
  }

}
