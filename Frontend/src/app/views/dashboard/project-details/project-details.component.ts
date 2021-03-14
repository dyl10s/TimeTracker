import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbTagComponent, NbTagInputAddEvent, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { UserDto } from 'src/app/core/models/auth/UserDto.model';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { ProjectDTO } from 'src/app/core/models/ProjectDTO.model';
import { CustomFilterService } from 'src/app/core/services/customFilterService.service';
import { CustomTreeBuilder } from 'src/app/core/services/customTreeBuilder.service';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  pageMode: string = "view";

  teamDataSource: NbTreeGridDataSource<UserDto>;
  teamMembers: TreeNode<UserDto>[] = [];

  gridHeaders: string[] = ["Name", "Role"];

  projectId: number;

  loadingProject: boolean = true;
  details: ProjectDTO = null;
  copyDetails: ProjectDTO = null;

  updateProjectForm: FormGroup = new FormGroup({
    tags: new FormControl({value: '', disabled: false}),
    details: new FormControl({value: '', disabled: false})
  });

  constructor(
    private projectService: ProjectService, 
    private route: ActivatedRoute,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<UserDto>,
    private toastrService: NbToastrService,
    private router: Router){

    this.projectId = parseInt(route.snapshot.paramMap.get('id'));
    projectService.getProjectById(this.projectId).subscribe(
      (results: GenericResponseDTO<ProjectDTO>) => {
        if(results.success){
          console.log(results.data);
          results.data.tags = results.data.tags.map(x => x.name);
          this.details = results.data;
          this.copyDetails = results.data;

          results.data.teacher.role = "Teacher";
          this.teamMembers.push({
            data: results.data.teacher
          });

          results.data.students.forEach(s => {
            s.role = "Student";
            this.teamMembers.push({
              data: s
            });
          });

          this.updateProjectForm.setValue({
            tags: this.details.tags,
            details: this.details.description
          });

        }else{
          // TODO Add error handling
        }

        this.teamDataSource = this.dataSourceBuilder.create(this.teamMembers);
        this.loadingProject = false;
      },
      (error) => {
        this.router.navigateByUrl("/dashboard/projects");
      });
  }

  getAllTags() : string[] {
    if(this.pageMode == 'view'){
      return this.details.tags;
    }else{
      return this.updateProjectForm.get('tags').value;
    }
  }

  onTagAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      if(this.updateProjectForm.get("tags").value.indexOf(value) === -1){
        this.updateProjectForm.get("tags").setValue([...this.updateProjectForm.get("tags").value, value]);
      }
    }
    input.nativeElement.value = '';
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.updateProjectForm.get("tags").value.splice(this.updateProjectForm.get("tags").value.indexOf(tagToRemove.text), 1);
  }

  saveProjectChange(): void {

    // Check if we made changes
    let changesMade = false;
    if(this.details.tags.length !== this.updateProjectForm.get("tags").value.length){
      changesMade = true;
    }

    if(!changesMade){
      this.details.tags.forEach((x: string, i: number) => {
        if(x !== this.updateProjectForm.get("tags")[i]){
          changesMade = true;
        }
      })
    }

    if(!changesMade) {
      this.toastrService.success("The project has been saved successfully", "Project Saved");
      this.pageMode = 'view';
      return;
    }

    this.loadingProject = true;

    this.projectService.updateProjectDetails(
      this.updateProjectForm.get("details").value,
      this.projectId
    ).subscribe((response: GenericResponseDTO) => {
      if(response.success == true){
        this.details.description = this.updateProjectForm.get("details").value;
        this.pageMode = 'view';
        this.toastrService.success("The project has been saved successfully", "Project Saved");
      }else{
        this.toastrService.danger("There was an error updating the project", "Error");
      }
    })

    this.projectService.setProjectTags(this.updateProjectForm.get("tags").value.map((x: string) => {
      return {
        projectId: this.projectId,
        tag: x
      };
    })).subscribe(
      (res: GenericResponseDTO) => {
        if(res.success === true){
          this.details.tags = this.updateProjectForm.get("tags").value;
          this.pageMode = 'view';
          this.toastrService.success("The project has been saved successfully", "Project Saved");
        }else{
          this.toastrService.danger("There was an error updating the project", "Error");
        }
        this.loadingProject = false;
      },
      (error) => {
        this.toastrService.danger("There was an error updating the project", "Error");
        this.loadingProject = false;
      }
    );
  }

  cancelEdit() {
    this.pageMode = 'view';
    this.updateProjectForm.get("tags").setValue(this.details.tags);
  }

  copyInviteCode(code: string) {
    const tempBox = document.createElement('textarea');
    tempBox.style.position = 'fixed';
    tempBox.style.left = '0';
    tempBox.style.top = '0';
    tempBox.style.opacity = '0';
    tempBox.value = `${window.location.origin}/auth/register?inviteCode=${code}`;
    document.body.appendChild(tempBox);
    tempBox.focus();
    tempBox.select();
    let success = document.execCommand('copy');
    document.body.removeChild(tempBox);
    if(success) {
      this.toastrService.show("Invite code has been copied", 'Success', {status:'success', duration: 4000})
    }else{
      this.toastrService.show("There was an error copping the invite code to your clipboard", 'Error', {status:'danger', duration: 4000})
    }
  }

  copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;

    for (key in mainObj) {
      objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}