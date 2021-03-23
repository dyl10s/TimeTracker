import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
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
  gridHeaders: string[] = ["date", "member", "hours"];
  timeEntryDataSource: NbTreeGridDataSource<any>;
  allEntries: TreeNode<any>[] = [];
  members: TreeNode<UserDto>[] = [];
  selectedMembers: any[] = [];
  memberIds: number[] = [];
  projectId: number;
  currentUserId: number;
  currentUserName: string;
  totalHours: number = 0;
  sortDateOption = 1;
  allSelected: boolean = false;

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
  }

  setTotalHours(num: number) {
    this.totalHours = num;
  }

  datesChanged(event) {
    this.loadReportDetails();
  }

  loadReportDetails() {
    this.getAllTimeEntries();
  }

  updateMembers() {
    console.log(this.selectedMembers)
    this.getAllTimeEntries();
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

  selectAllToggle() {
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
    let hours: number = 0;

    this.reportService.getDetailsReport(this.projectId, this.startDate, this.endDate).subscribe(
      (results: GenericResponseDTO) => {
        if (results.success) {
          results.data.forEach((user) => {
            if (this.checkMembers(user.userId)) {
              user.timeEntries.forEach((entry) => {
                hours += entry.length;
                this.allEntries.push({
                  data: {
                    day: entry.day,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    length: entry.length,
                  },
                  children: [
                    {
                      data: {
                        notes: entry.notes,
                        day: '',
                        firstName: '',
                        lastName: '',
                        length: ''
                      }}]})});}});
        } else {
          // TODO Add error handling
        }
        this.sortDate(this.sortDateOption);
        this.setTotalHours(hours);
        this.timeEntryDataSource = this.dataSourceBuilder.create(this.allEntries);
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
    if (num == 1) {
      this.sortDateOption = 1;
      this.allEntries.sort((x, y) => {
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
    else if (num == 2) {
      this.sortDateOption = 2;
      this.allEntries.sort((y, x) => {
        let xDate = new Date(x.data.day);
        let yDate = new Date(y.data.day);
        if (xDate.getTime() < yDate.getTime())
          return -1;
        else if (xDate.getTime() > yDate.getTime())
          return 1;
        return 0;
      });
    }
    this.timeEntryDataSource = this.dataSourceBuilder.create(this.allEntries);
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
