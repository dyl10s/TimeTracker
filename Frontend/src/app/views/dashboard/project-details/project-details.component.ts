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
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {

  lineChartData: any = [{
    'name': 'Total Hours Spent',
    'series': [
    ]
  }];

  barChartData: any = [];

  colorScheme: any = {
    'domain': ['#0095ff']
  }

  lineChartYMax: number;
  barChartYMax: number = 0;

  pageMode: string = "view";

  teamDataSource: NbTreeGridDataSource<UserDto>;
  teamMembers: TreeNode<UserDto>[] = [];

  gridHeaders: string[] = ["Name", "Role", "Hours"];

  projectId: number;

  loadingProject: boolean = true;
  details: ProjectDTO = null;

  displayBarChart: boolean = false;

  startDate: any = new Date();
  endDate: any = new Date();

  updateProjectForm: FormGroup = new FormGroup({
    tags: new FormControl({value: '', disabled: false})
  });

  detailsReport: any = {};

  constructor(
    private projectService: ProjectService, 
    private route: ActivatedRoute,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<UserDto>,
    private toastrService: NbToastrService,
    private router: Router,
    private reportService: ReportService){

    this.startDate.setDate(this.startDate.getDate() - 7);

    this.projectId = parseInt(route.snapshot.paramMap.get('id'));
    projectService.getProjectById(this.projectId).subscribe(
      (results: GenericResponseDTO<ProjectDTO>) => {
        if(results.success){
          results.data.tags = results.data.tags.map(x => x.name);
          this.details = results.data;
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
            tags: [...this.details.tags]
          });

        }else{
          // TODO Add error handling
        }

        this.teamDataSource = this.dataSourceBuilder.create(this.teamMembers);
        this.loadingProject = false;
      },
      (error) => {
        this.router.navigateByUrl("/dashboard/projects");
      }
    );

    this.setUpCharts();

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
    this.updateProjectForm.get("tags").setValue([...this.details.tags]);
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

  setHours() {
    let userSum = 0;
    this.detailsReport.data.forEach((user) => {
      user.timeEntries.forEach((entry) => {
        let date = new Date(entry.day);
        if(date.getTime() >= this.startDate.getTime() && date.getTime() <= this.endDate.getTime())
          userSum += entry.length;
      });
      let currentTeamMember: any = this.teamMembers.find(member => (member as any).data.id === user.userId);
      if(currentTeamMember) {
        currentTeamMember.data.hours = userSum;
      }
      userSum = 0;
    });
    this.teamDataSource = this.dataSourceBuilder.create(this.teamMembers);
  }
  
  setUpCharts() {

    // get all time entries associated with a specific project
    this.reportService.getDetailsReport(this.projectId, new Date(2020, 1, 1), new Date()).subscribe(
      (results: GenericResponseDTO) => {
        this.detailsReport = results;
        this.setHours();
        // put all the entries for all users into a single array
        let allEntries = [];
        results.data.forEach((user) => {
          user.timeEntries.forEach((entry) => {
            entry.day += 'Z'; // append a Z to the datetime strings to signify that they're in UTC time
            allEntries.push(entry);
          });
        });

        // sort the array in ascending order by date
        allEntries.sort((x, y) => {
          let xDate = new Date(x.day);
          let yDate = new Date(y.day);
          if(xDate.getTime() < yDate.getTime())
            return -1;
          else if(xDate.getTime() > yDate.getTime())
            return 1;
          return 0;
        });

        // set the date range for each week
        let startDate = new Date(allEntries[0].day);
        startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date(startDate.toDateString());
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        // variables used in the chart
        let total = 0;
        let subtotal = 0;
        let currentWeek = 1;

        // plot the times and totals on the charts
        allEntries.forEach((entry) => {
          if(new Date(entry.day).getTime() > endDate.getTime()) {
            let endDateString = endDate.toDateString();
            endDateString = endDateString.substring(endDateString.indexOf(' '));
            let startDateString = startDate.toDateString();
            startDateString = startDateString.substring(startDateString.indexOf(' '));
            if(startDateString.substring(startDateString.lastIndexOf(' ')) === endDateString.substring(endDateString.lastIndexOf(' '))) {
              startDateString = startDateString.substring(0, startDateString.lastIndexOf(' '));
            }
            this.lineChartData[0].series.push({
              'name': endDateString,
              'value': total,
              'week': currentWeek,
              'startDate': startDateString
            });
            this.barChartData.push({
              'name': endDateString,
              'value': subtotal,
              'extra': {
                'week': currentWeek,
                'startDate': startDateString
              }
            });
            startDate.setDate(startDate.getDate() + 7);
            endDate.setDate(endDate.getDate() + 7);
            if(subtotal * 1.1 > this.barChartYMax)
              this.barChartYMax = subtotal * 1.1;   // set the height of the bar chart
            subtotal = 0;
            currentWeek++;
          }
          subtotal += entry.length;
          total += entry.length;
        });

        // plot the last point on the charts
        let endDateString = endDate.toDateString();
        endDateString = endDateString.substring(endDateString.indexOf(' '));
        let startDateString = startDate.toDateString();
        startDateString = startDateString.substring(startDateString.indexOf(' '));
        if(startDateString.substring(startDateString.lastIndexOf(' ')) === endDateString.substring(endDateString.lastIndexOf(' '))) {
          startDateString = startDateString.substring(0, startDateString.lastIndexOf(' '));
        }
        this.lineChartData[0].series.push({
          'name': endDateString,
          'value': total,
          'week': currentWeek,
          'startDate': startDateString
        });
        this.barChartData.push({
          'name': endDateString,
          'value': subtotal,
          'extra': {
            'week': currentWeek,
            'startDate': startDateString
          }
        });

        if(subtotal * 1.1 > this.barChartYMax)
          this.barChartYMax = subtotal * 1.1;   // set the height of the bar chart

        // set the height of the line chart
        this.lineChartYMax = total * 1.1;

        // apply the changes made to the graphs' data structures
        this.lineChartData = [...this.lineChartData];
        this.barChartData = [...this.barChartData];
      }
    );

  }

}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}