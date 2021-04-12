import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { TimeEntry } from 'src/app/core/models/TimeEntry.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { TimeEntryApiService } from 'src/app/core/services/timeEntry.api.service';

@Component({
  selector: 'app-edit-time',
  templateUrl: './edit-time.component.html',
  styleUrls: ['./edit-time.component.scss']
})
export class EditTimeComponent implements OnInit {

  showLoadingSpinner: boolean = false;
  projects: any;
  selectedItem = '0';
  event: any;

  EditTimeForm: FormGroup = new FormGroup({
    projectName: new FormControl(''),
    notes: new FormControl(''),
    time: new FormControl('')
  });

  constructor(
    private ref: NbDialogRef<EditTimeComponent>,
    private projectService: ProjectService,
    private timeEntryService: TimeEntryApiService,
  ){  }

  ngOnInit() {
    console.log(this.event)
    this.projectService.getActiveProjectsByUser().subscribe((response: GenericResponseDTO) => {
      this.projects = response.data;

      this.EditTimeForm.patchValue({
        projectName: this.event.project.id,
        notes: this.event.notes,
        time: this.event.length
      });
    });
  }

  closeDialog() {
    this.ref.close({ update: true });
  }

  editTimer() { }

  updateEntry(form) {
    const entry: TimeEntry = {
      id: this.event.id,
      day: this.event.day,
      length: parseFloat(form.value.time),
      notes: form.value.notes,
      projectId: this.event.project.id
    };

    this.timeEntryService.updateTimeEntry(entry).subscribe((response: GenericResponseDTO) => {
      this.ref.close({ success: response.success, data: response.data });
    });
  }

  deleteEntry() {

  }

}
