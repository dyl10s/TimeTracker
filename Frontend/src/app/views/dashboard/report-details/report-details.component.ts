import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { UserDto } from 'src/app/core/models/auth/UserDto.model';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  timeEntryDataSource: NbTreeGridDataSource<any>;
  allEntries: TreeNode<any>[] = [];
  members: TreeNode<UserDto>[] = [];
  gridHeaders: string[] = ["date", "notes", "member", "hours"];
  totalHours: number = 0;
  sortDateOption = 1;
  selectedMember: any[];
  projectId: number;
  currentUserId: number;
  currentUserName: string;

  constructor(
    private route: ActivatedRoute,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private reportService: ReportService,
  ) {
    this.projectId = parseInt(route.snapshot.paramMap.get('projId'));
    this.currentUserId = parseInt(route.snapshot.paramMap.get('userId'));
    this.getAllTimeEntries();
  }

  ngOnInit(): void {
    this.selectedMember = [this.currentUserId];
  }

  getAllTimeEntries() {
    this.allEntries = [];
    this.members = [];
    let hours: number = 0;

    this.reportService.getDetailsReport(this.projectId, this.startDate, this.endDate).subscribe(
      (results: GenericResponseDTO) => {
        if (results.success) {
          results.data.forEach((user) => {
            if (user.userId != this.currentUserId) {
              this.members.push(user)
            } else {
              this.currentUserName = user.firstName + " " + user.lastName;
            }

            if (this.checkMembers(user.userId)) {
              user.timeEntries.forEach((entry) => {
                hours += entry.length;
                this.allEntries.push({
                  data: {
                    day: entry.day,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    length: entry.length,
                    notes: entry.notes
                  },
                  //   children: results.data.map(s => { // WRONG
                  //     s.notes = entry.notes
                  //     return {
                  //       data: s,
                  //       expanded: false7
                  //     }
                  //   }),
                  //   expanded: false
                })
              });
            }
          });
        } else {
          // Implement Error Checking
        }
        this.sortDate(this.sortDateOption);
        this.setTotalHours(hours);
        this.timeEntryDataSource = this.dataSourceBuilder.create(this.allEntries);
      });
  }

  updateMembers() {
    console.log(this.selectedMember);
    this.selectedMember.forEach(element => {
      if (element == '0') {
        this.members.forEach(element2 => {
          if (element2 != element) {
            this.selectedMember.push(element2);
          }
        })
      }
    });
  }

  checkMembers(num: number): boolean {
    let bool: boolean = false;
    this.selectedMember.forEach(element => {
      if (element == num) {
        bool = true;
      }
    });
    return bool;
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


  sortDate(num: number) {
    // Ascending
    if (num == 1) {
      console.log(1)
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
      console.log(2)
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
  }

}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
