import { Component } from '@angular/core';
import { NbGetters, NbTreeGridDataService, NbTreeGridFilterService, NbTreeGridService, NbTreeGridSortService } from '@nebular/theme';
import { NbDialogService, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { ProjectDTO } from 'src/app/core/models/ProjectDTO.model';
import { CustomFilterService } from 'src/app/core/services/customFilterService.service';
import { CustomTreeBuilder } from 'src/app/core/services/customTreeBuilder.service';
import { ProjectService } from 'src/app/core/services/project.service';
import { CreateProjectComponent } from 'src/app/shared/components/create-project/create-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent {

  showLoadingSpinner: boolean = false;
  activeDataSource: NbTreeGridDataSource<ProjectDTO> = null;
  archivedDataSource: NbTreeGridDataSource<ProjectDTO> = null;

  activeProjects: TreeNode<ProjectDTO>[] = [];
  archivedProjects: TreeNode<ProjectDTO>[] = [];

  showActive: boolean = true;

  gridHeaders: string[] = ["Client", "Project Name", "Actions"];

  constructor(
    private dataSourceBuilder: CustomTreeBuilder<ProjectDTO>, 
    private projectService: ProjectService, 
    private toastrService: NbToastrService,
    private dialogService: NbDialogService) {

    this.loadProjects();
  }

  loadProjects() {
    this.showLoadingSpinner = true;
    this.activeProjects = [];

    this.projectService.getProjectsByUser().subscribe((res: GenericResponseDTO) => {
      res.data.forEach(x => {
        if(x.archivedDate == null) {
          this.activeProjects.push({
            data: x
          });
        }else{
          this.archivedProjects.push({
            data: x
          });
        }
      }, (err) => {
        console.log(err)
      });

      let customFilter = new CustomFilterService<ProjectDTO>();
      customFilter.setFilterColumns(["name", "clientName"]);

      this.activeDataSource = this.dataSourceBuilder.create(this.activeProjects, customFilter);
      this.archivedDataSource = this.dataSourceBuilder.create(this.archivedProjects, customFilter);
      this.showLoadingSpinner = false;
    })
  }

  viewArchivedProjects() {
    this.showActive = false;
  }

  viewActiveProjects() {
    this.showActive = true;
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

  openCreateNewProject() {
    this.dialogService.open(CreateProjectComponent, {}).onClose.subscribe((x: any) => {
      if(x.update) {
        this.loadProjects();
      }
    });
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

