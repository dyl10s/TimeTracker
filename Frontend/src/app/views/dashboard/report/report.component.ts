import { Component } from '@angular/core';
import { NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProjectService } from 'src/app/core/services/project.service';
import { ReportService } from 'src/app/core/services/report.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {

  projectsDataSource: NbTreeGridDataSource<any>;
  projects: TreeNode<any>[] = [];

  startDate: Date = new Date();
  endDate: Date = new Date();

  gridHeaders: string[] = ["name", "hours"];

  projectCache: any[];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private reportService: ReportService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private tostrService: NbToastrService) {
    
    this.startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() - this.startDate.getDay() + 1);
    this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate() + 6);
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
    this.projects = [];

    forkJoin(
      this.projectCache.map(p => this.reportService.getLengthReport(p.id, this.startDate, this.endDate))
    ).subscribe(projReport => {
      projReport.forEach((x, i) => {
        this.getProjectHours(this.projectCache[i], x);
      });

      console.log(this.projects);
      this.projectsDataSource = this.dataSourceBuilder.create(this.projects);
    });
  }

  navigateToReport(projectId: number, userId: number) {
    this.router.navigateByUrl(`/dashboard/reports/details?projectId=${projectId}&userId=${userId}`)
  }

  getProjectHours(proj: any, hoursReport: any) {
      // Total Hours
      let totalHours: number = 0;
      hoursReport.data.forEach(r => {
        totalHours += r.hours;
      })

      this.projects.push({
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

  datesChanged(event) {
    this.loadProjectHours();
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
