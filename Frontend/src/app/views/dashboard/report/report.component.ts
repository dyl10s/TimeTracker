import { Component } from '@angular/core';
import { NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
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

  projectCache: any[];

  showActive: boolean = true;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private reportService: ReportService,
    private dataSourceBuilder: CustomTreeBuilder<any>,
    private tostrService: NbToastrService) {

    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService.getProjectsByUser().subscribe((res) => {
      if(res.success) {
        this.projectCache = res.data;
        this.loadProjectHours();
      }
    }, 
    () => {
      this.tostrService.danger("There was an error loading the projects.", "Error");
    });
  }

  loadProjectHours() {
    this.activeProjects = [];
    this.archivedProjects = [];

    forkJoin(
      this.projectCache.map(p => this.reportService.getLengthReport(p.id, this.startDate, this.endDate))
    ).subscribe(projReport => {
      projReport.forEach((x, i) => {
        this.getProjectHours(this.projectCache[i], x);
      });

      let customFilter = new CustomFilterService<any>();
      customFilter.setFilterColumns(["name", "firstName", "lastName"]);
  
      this.activeDataSource = this.dataSourceBuilder.create(this.activeProjects, customFilter);
      this.archivedDataSource = this.dataSourceBuilder.create(this.archivedProjects, customFilter);

    });
  }

  getProjectHours(proj: any, hoursReport: any) {
      // Total Hours
      let totalHours: number = 0;
      hoursReport.data.forEach(r => {
        totalHours += r.hours;
      })

      if(proj.archivedDate) {
        this.activeProjects.push({
          data: {
            name: proj.name,
            hours: totalHours
          },
          children: hoursReport.data.map(s => {
            s.projId = proj.id;
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
    this.loadProjectHours();
  }

  viewArchivedProjects() {
    this.showActive = false;
  }

  viewActiveProjects() {
    this.showActive = true;
  } 

}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface test {
  name: string;
  hours: number;
}