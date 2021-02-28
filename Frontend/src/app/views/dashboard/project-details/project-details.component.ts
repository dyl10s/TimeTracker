import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbTagComponent, NbTagInputAddEvent, NbTreeGridDataSource } from '@nebular/theme';
import { UserDto } from 'src/app/core/models/auth/UserDto.model';
import { ProjectDTO } from 'src/app/core/models/ProjectDTO.model';
import { CustomFilterService } from 'src/app/core/services/customFilterService.service';
import { CustomTreeBuilder } from 'src/app/core/services/customTreeBuilder.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  pageMode: string = "view";

  teamDataSource: NbTreeGridDataSource<UserDto>;
  gridHeaders: string[] = ["Name"];

  details: ProjectDTO = {
    clientName: "Test Client",
    createdTime: new Date().toUTCString(),
    description: "This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. This is a test project description for UI design. ",
    inviteCode: "123",
    name: "Test Project",
    tags: ["Winter", "2020", "Winter", "2020"],
    id: 1,
    teacher: null,
    students: [],
    archivedData: '10/10/2020'
  };

  constructor(){}

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      if(this.details.tags.indexOf(value) === -1){
        this.details.tags.push(value);
      }
    }
    input.nativeElement.value = '';
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.details.tags.splice(this.details.tags.indexOf(tagToRemove.text), 1);
  }
}