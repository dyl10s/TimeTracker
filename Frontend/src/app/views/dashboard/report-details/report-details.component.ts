import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { element } from 'protractor';
import { UserDto } from 'src/app/core/models/auth/UserDto.model';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { ProjectDTO } from 'src/app/core/models/ProjectDTO.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  gridHeaders: string[] = ["date", "notes", "member", "hours"];
  timeEntryDataSource: NbTreeGridDataSource<any>;
  allEntries: TreeNode<any>[] = [];
  tempEntries: TreeNode<any>[] = [];
  members: TreeNode<UserDto>[] = [];
  selectedMembers: any[] = [];
  memberIds: number[] = [];
  projectId: number;
  currentUserId: number;
  currentUserName: string;
  totalHours: number = 0;
  sortDateOption = 1;
  allSelected: boolean = false;
  rowExpand: boolean = false;
  rowToggleText: string = "";
  dateToggleText: string = "";
  dateToggle: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private projectService: ProjectService,
    private reportService: ReportService,
  ) {
    this.projectId = parseInt(route.snapshot.paramMap.get('projId'));
    this.currentUserId = parseInt(route.snapshot.paramMap.get('userId'));
    this.getAllTimeEntries();
    this.getAllMembers();
  }

  ngOnInit(): void {
    this.selectedMembers = [this.currentUserId];
    this.rowToggleText = "Expand";
    this.dateToggleText = "Descend"
    this.dateToggle = true;
  }

  datesChanged(event) {
    this.loadReportDetails();
  }

  loadReportDetails() {
    this.getAllTimeEntries();
  }

  getTotalHours() {
    let hours: number = 0;
    this.tempEntries.forEach(element => {
      hours += element.data.length
    })
    this.totalHours = hours;
  }

  checkMembers(num: number): boolean {
    let bool: boolean = false;
    this.selectedMembers.forEach(element => {
      if (element == num) {
        bool = true;
      }
    });
    return bool;
  }

  updateMembers() {
    this.tempEntries = [];
    console.log(this.selectedMembers)
    this.allEntries.forEach(element => {
      if(this.checkMembers(element.data.id)){
        this.tempEntries.push(element);
      }
    })
    this.getTotalHours();
    this.timeEntryDataSource = this.dataSourceBuilder.create(this.tempEntries);
  }

  rowToggle() {
    this.rowExpand =!this.rowExpand;
    if(this.rowToggleText == "Expand"){
      this.rowToggleText = "Collapse";
    }else {
      this.rowToggleText = "Expand";
    }
    this.tempEntries.forEach( x => {
      x.expanded = this.rowExpand;
    })
    this.timeEntryDataSource = this.dataSourceBuilder.create(this.tempEntries);
  }

  selectAllToggle() {
    let selectEntries = [];
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      if (this.selectedMembers.indexOf(this.currentUserId) == -1) {
        this.selectedMembers.push(this.currentUserId);
      }
      for (let i = 0; i < this.memberIds.length; i++) {
        if (this.selectedMembers.indexOf(this.memberIds[i]) == -1) {
          this.selectedMembers.push(this.memberIds[i]);
        }
      }
    } else {
      this.selectedMembers = [];
    }
   this.updateMembers();
  }

  getAllTimeEntries() {
    this.allEntries = [];

    this.reportService.getDetailsReport(this.projectId, this.startDate, this.endDate).subscribe(
      (results: GenericResponseDTO) => {
        if (results.success) {
          results.data.forEach((user) => {
              user.timeEntries.forEach((entry) => {
                this.allEntries.push({
                  data: {
                    day: entry.day,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    length: entry.length,
                    notes: entry.notes,
                    id: user.userId
                  },
                  children: [
                    {
                      data: {
                        notes: entry.notes,
                        day: '',
                        firstName: '',
                        lastName: '',
                        length: '',
                        expanded: false
                      }}],
                    expanded: false})});
                });
        } else {
          // TODO Add error handling
        }
        this.updateMembers();
        this.timeEntryDataSource = this.dataSourceBuilder.create(this.tempEntries);
        this.sortDate(1);
        this.getTotalHours();

      },
      (error) => {
        this.router.navigateByUrl("/dashboard/reports");
      });
  }

  getAllMembers() {
    this.members = [];
    this.projectService.getProjectById(this.projectId).subscribe(
      (results: GenericResponseDTO<ProjectDTO>) => {
        if (results.success) {
          if (results.data.teacher.id != this.currentUserId) {
            this.members.push(results.data.teacher)
            this.memberIds.push(results.data.teacher.id);
          } else {
            this.currentUserName = results.data.teacher.firstName +
            " " + results.data.teacher.lastName;
          }

          results.data.students.forEach(s => {
            if (s.id != this.currentUserId) {
              this.members.push(s)
              this.memberIds.push(s.id);
            } else {
              this.currentUserName = s.firstName + " " + s.lastName;
            }
          });
        } else {
          // TODO Add error handling
        }
      },
      (error) => {
        this.router.navigateByUrl("/dashboard/reports");
      }
    );
  }

  sortDate(num: number) {
    // Ascending
    if (num == 1 || 5 && !this.dateToggle) {
      if(num == 5) {
      this.dateToggleText = "Descend";
      this.dateToggle = !this.dateToggle;
      }
      this.tempEntries.sort((x, y) => {
        let xDate = new Date(x.data.day);
        let yDate = new Date(y.data.day);
        if (xDate.getTime() < yDate.getTime())
          return -1;
        else if (xDate.getTime() > yDate.getTime())
          return 1;
        return 0;
      });
    }

    // Descending
    else if (5 && this.dateToggle) {
      this.dateToggleText = "Ascend";
      this.dateToggle = !this.dateToggle;
      this.tempEntries.sort((y, x) => {
        let xDate = new Date(x.data.day);
        let yDate = new Date(y.data.day);
        if (xDate.getTime() < yDate.getTime())
          return -1;
        else if (xDate.getTime() > yDate.getTime())
          return 1;
        return 0;
      });
    }
    this.timeEntryDataSource = this.dataSourceBuilder.create(this.tempEntries);
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
