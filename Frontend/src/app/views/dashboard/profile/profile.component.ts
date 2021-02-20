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
  private projects: string[];

  constructor(private profileService: ProfileService) {
    this.firstName = " ";
    this.lastName = " ";
    this.emailAddress = " ";
    this.profileService.getProfileInfo().subscribe(
      (httpResponse: GenericResponseDTO) => {
        let tokens = httpResponse.data.name.split(" ", 2);
        this.firstName = tokens[0];
        this.lastName = tokens[1];
        this.emailAddress = httpResponse.data.email;
        this.projects = httpResponse.data.projects;
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

  public getProjects(): string[] {
    return this.projects;
  }

  ngOnInit(): void {
    
  }

}
