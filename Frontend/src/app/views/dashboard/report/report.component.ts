import { Component } from '@angular/core';
import { NbToastrService, NbTreeGridDataSource } from '@nebular/theme';
import { ProjectService } from 'src/app/core/services/project.service';
import { ReportService } from 'src/app/core/services/report.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { CustomFilterService } from 'src/app/core/services/customFilterService.service';
import { CustomTreeBuilder } from 'src/app/core/services/customTreeBuilder.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {

  activeDataSource: NbTreeGridDataSource<any>;
  archivedDataSource: NbTreeGridDataSource<any>;

  activeProjects: TreeNode<any>[] = [];
  archivedProjects: TreeNode<any>[] = [];

  startDate: Date = new Date();
  endDate: Date = new Date();

  gridHeaders: string[] = ["name", "hours"];

  activeProjectCache: any[];
  archivedProjectCache: any[];

  showActive: boolean = true;
  showLoadingSpinner: boolean = true;

  searchQuery: string;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private reportService: ReportService,
    private dataSourceBuilder: CustomTreeBuilder<any>,
    private tostrService: NbToastrService) {
    
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() - this.startDate.getDay() + 1);
    this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 6);
    this.getActiveProjects();
  }

  getActiveProjects() {
    this.showLoadingSpinner = true;
    this.projectService.getActiveProjectsByUser().subscribe((res) => {
      if(res.success) {
        this.activeProjectCache = res.data;
        this.loadActiveProjectHours();
      }
    }, 
    () => {
      this.showLoadingSpinner = false;
      this.tostrService.danger("There was an error loading the projects.", "Error");
    });
  }

  loadActiveProjectHours() {
    this.showLoadingSpinner = true;
    this.activeProjects = [];

    forkJoin(
      this.activeProjectCache.map(p => this.reportService.getLengthReport(p.id, this.startDate, this.endDate))
    ).subscribe(projReport => {
      projReport.forEach((x, i) => {
        this.getProjectHours(this.activeProjectCache[i], x);
      });

      let customFilter = new CustomFilterService<any>();
      customFilter.setFilterColumns(["name", "fullName"]);
  
      this.activeDataSource = this.dataSourceBuilder.create(this.activeProjects, customFilter);

      // This will hide the spinner after the first report request is made
      // this is incorrect but I am going to be making this into a single API call in
      // another story this sprint so there is no need for me to google around for
      // how to do this properly
      this.showLoadingSpinner = false;
    });
  }

  getArchivedProjects() {
    this.showLoadingSpinner = true;
    this.projectService.getArchivedProjectsByUser().subscribe((res) => {
      if(res.success) {
        this.archivedProjectCache = res.data;
        this.loadArchivedProjectHours();
      }
    }, 
    () => {
      this.showLoadingSpinner = false;
      this.tostrService.danger("There was an error loading the projects.", "Error");
    });
  }

  loadArchivedProjectHours() {
    this.archivedProjects = [];

    forkJoin(
      this.archivedProjectCache.map(p => this.reportService.getLengthReport(p.id, this.startDate, this.endDate))
    ).subscribe(projReport => {
      projReport.forEach((x, i) => {
        this.getProjectHours(this.archivedProjectCache[i], x);
      });

      let customFilter = new CustomFilterService<any>();
      customFilter.setFilterColumns(["name", "fullName"]);
  
      this.archivedDataSource = this.dataSourceBuilder.create(this.archivedProjects, customFilter);
      this.archivedDataSource.filter(this.searchQuery);
      this.showLoadingSpinner = false;
    });
  }

  getProjectHours(proj: any, hoursReport: any) {
      // Total Hours
      let totalHours: number = 0;
      hoursReport.data.forEach(r => {
        totalHours += r.hours;
      })

      if(proj.archivedDate == null) {
        this.activeProjects.push({
          data: {
            name: proj.name,
            hours: totalHours
          },
          children: hoursReport.data.map(s => {
            s.projId = proj.id;
            s.fullName = s.firstName + " " + s.lastName;
            return {
              data: s,
              expanded: false
            }
          }),
          expanded: false
        });
      } else {
        this.archivedProjects.push({
          data: {
            name: proj.name,
            hours: totalHours
          },
          children: hoursReport.data.map(s => {
            s.projId = proj.id;
            s.fullName = s.firstName + " " + s.lastName;
            return {
              data: s,
              expanded: false
            }
          }),
          expanded: false
        });
      }
  }

  datesChanged(event) {
    this.loadActiveProjectHours();

    if(this.archivedDataSource != null) {
      this.loadArchivedProjectHours();
    }
  }

  viewArchivedProjects() {
    this.showActive = false;

    if(this.archivedDataSource == null) {
      this.getArchivedProjects();
    }else{
      this.archivedDataSource.filter(this.searchQuery);
    }
  }

  viewActiveProjects() {
    this.showActive = true;
    this.activeDataSource.filter(this.searchQuery);
  } 

}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}