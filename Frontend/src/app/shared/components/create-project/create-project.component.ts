import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { ProjectService } from 'src/app/core/services/project.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {

  showLoadingSpinner: boolean = false;

  createProjectForm: FormGroup = new FormGroup({
    clientName: new FormControl(''),
    description: new FormControl(''),
    projectName: new FormControl(''),
    tags: new FormControl('')
  });

  constructor(
    private ref: NbDialogRef<CreateProjectComponent>,
    private projectService: ProjectService,
    private toastrService: NbToastrService) { 
  }

  closeDialog() {
    this.ref.close({update: false});
  }

  submitDialog(form: any) {

    if(!form.clientName) {
      this.toastrService.show("A client name is required", 'Invalid Data', {status:'danger', duration: 5000});
      return;
    }

    if(!form.projectName) {
      this.toastrService.show("A project name is required", 'Invalid Data', {status:'danger', duration: 5000});
      return;
    }

    let tags: string[] = [];
    if(form.tags) {
      tags = form.tags.split(",");
      for(let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
      }
    }

    this.showLoadingSpinner = true;
    
    this.projectService.createProject({
      clientName: form.clientName,
      description: form.description,
      projectName: form.projectName,
      tags: tags
    }).subscribe((res: GenericResponseDTO) => {
      if(res.success) {
        this.toastrService.show("Success", 'New project has been created', {status:'success', duration: 4000});
        this.ref.close({update: true});
      }else{
        this.toastrService.show("Error", 'There was an error creating your project', {status:'danger', duration: 4000});
      }

      this.showLoadingSpinner = false;
    }, (err) => {
      console.log(err);
    });
  }
}
