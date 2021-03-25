import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
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
  gridHeaders: string[] = ["date", "modDate", "notes", "member", "hours"];
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
  dateToggle: boolean;
  modifiedDateToggle: boolean;
  createSort: boolean;
  modSort: boolean;

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
    this.dateToggle = true;
    this.modifiedDateToggle = true;
    this.createSort = false;
    this.modSort = false;
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
      if (this.checkMembers(element.data.id)) {
        this.tempEntries.push(element);
      }
    })
    this.getTotalHours();
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
                  dateModified: entry.lastModified,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  length: entry.length,
                  notes: entry.notes,
                  id: user.userId
                }
              })
            });
          });
        } else {
          // TODO Add error handling
        }
        this.updateMembers();
        this.sortDate(1);
        this.timeEntryDataSource = this.dataSourceBuilder.create(this.tempEntries);
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

    if (num == 5) {
      this.createSort = true;
      this.modSort = false;
    } if (num == 6) {
      this.modSort = true;
      this.createSort = false;
    }
    // Ascending
    if (num == 1 || num == 5 && !this.dateToggle || num == 6 && !this.modifiedDateToggle) {
      if (num == 5) {
        this.dateToggle = !this.dateToggle;
      }

      if (num == 1 || num == 5) {
        this.tempEntries.sort((x, y) => {
          let xDate = new Date(x.data.day);
          let yDate = new Date(y.data.day);
          if (xDate.getTime() < yDate.getTime())
            return -1;
          else if (xDate.getTime() > yDate.getTime())
            return 1;
          return 0;
        });
      } else {
        this.modifiedDateToggle = !this.modifiedDateToggle;
        this.tempEntries.sort((x, y) => {
          let xDate = new Date(x.data.dateModified);
          let yDate = new Date(y.data.dateModified);
          if (xDate.getTime() < yDate.getTime())
            return -1;
          else if (xDate.getTime() > yDate.getTime())
            return 1;
          return 0;
        });
      }
    }

    // Descending
    else if (num == 5 && this.dateToggle || num == 6 && this.modifiedDateToggle) {
      if (num == 5) {
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
      } else {
        this.modifiedDateToggle = !this.modifiedDateToggle;
        this.tempEntries.sort((y, x) => {
          let xDate = new Date(x.data.dateModified);
          let yDate = new Date(y.data.dateModified);
          if (xDate.getTime() < yDate.getTime())
            return -1;
          else if (xDate.getTime() > yDate.getTime())
            return 1;
          return 0;
        });
      }
    }
    this.timeEntryDataSource = this.dataSourceBuilder.create(this.tempEntries);
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
