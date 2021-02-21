import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProjectsComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }
  ngOnInit(): void { }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.matDialog.open(CreateProjectComponent, dialogConfig);
  }

  columnsToDisplay = ['Name', 'Time'];
  expandedElement: infoElement | null;
  dataSource = new MatTableDataSource(null);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
// Temp data values to display table //
export interface infoElement {
  Name: string;
  Time: number;
  Details: string;
}

