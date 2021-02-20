import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../core/services/profile.service';
import { GenericResponseDTO } from '../../../core/models/GenericResponseDTO.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private firstName: string;
  private lastName: string;
  private emailAddress: string;

  constructor(private profileService: ProfileService) {
    this.profileService.getProfileInfo().subscribe(
      (httpResponse: GenericResponseDTO) => {
        let tokens = httpResponse.data.name.split(" ", 2);
        this.firstName = tokens[0];
        this.lastName = tokens[1];
        this.emailAddress = httpResponse.data.email;
      }
    );
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmailAddress(): string {
    return this.emailAddress;
  }

  ngOnInit(): void {
    
  }

}
