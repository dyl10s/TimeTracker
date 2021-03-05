import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { TimeEntry } from 'src/app/core/models/TimeEntry.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { TimeEntryApiService } from 'src/app/core/services/timeEntry.api.service';
@Component({
  selector: 'app-create-time',
  templateUrl: './create-time.component.html',
  styleUrls: ['./create-time.component.scss']
})
export class CreateTimeComponent implements OnInit {

  day: any;
  projects: any;
  showLoadingSpinner: boolean = false;
  selectedItem = '0';

  createTimeForm: FormGroup = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    time: new FormControl('', [Validators.required])
  });

  constructor(
    private ref: NbDialogRef<CreateTimeComponent>,
    private projectService: ProjectService,
    private timeEntryService: TimeEntryApiService
  ) { }

  ngOnInit() {
    console.log(this.day)
    this.projectService.getProjectsByUser().subscribe((response: GenericResponseDTO) => {
      this.projects = response.data;
    });
  }

  closeDialog() {
    this.ref.close({ update: false });
  }

  startTimer() { }

  addTime(timeForm: FormGroup) {
    if(!parseFloat(timeForm.value.time)){
      timeForm.controls['time'].reset();
      return;
    }

    const time: TimeEntry = {
      Length: parseFloat(timeForm.value.time),
      Notes: timeForm.value.notes,
      ProjectId: timeForm.value.projectName,
      Day: this.day
    };

    this.timeEntryService.postTimeEntry(time).subscribe((response: GenericResponseDTO) => {
      if(response.success){
        this.ref.close({ success: true, update: true });
      }
    })
  }

}
