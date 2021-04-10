import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { GenericResponseDTO } from 'src/app/core/models/GenericResponseDTO.model';
import { TimeEntry } from 'src/app/core/models/TimeEntry.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { TimeEntryApiService } from 'src/app/core/services/timeEntry.api.service';
import { TimerService } from 'src/app/core/services/timer.service';
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
    time: new FormControl('', [Validators.pattern(/^[0-9]*(\.[0-9]+)?$/)])
  });

  constructor(
    private ref: NbDialogRef<CreateTimeComponent>,
    private projectService: ProjectService,
    private timeEntryService: TimeEntryApiService,
    private timerService: TimerService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit() {
    this.projectService.getActiveProjectsByUser().subscribe((response: GenericResponseDTO) => {
      this.projects = response.data;
    });
  }

  closeDialog() {
    this.ref.close({ update: false });
  }

  submit(timeForm: FormGroup) {
    this.showLoadingSpinner = true;
    if(timeForm.value.time == ''){
      //Start Timer
      this.timerService.startTimer(timeForm.value.notes, timeForm.value.projectName).subscribe((response: GenericResponseDTO) => {
        if(response.success){
          this.showLoadingSpinner = false;
          this.toastrService.success("Timer successfully started", "Success");
          this.ref.close({ success: true, update: true, item: 'timer' });
        }
      }, (err) => {
        this.showLoadingSpinner = false;
        this.toastrService.danger("There was an error starting the timer", "Error");
      })
    }else{
      if(!parseFloat(timeForm.value.time)){
        timeForm.controls['time'].reset();
        this.showLoadingSpinner = false;
        this.toastrService.danger('An error occured while converting the text in the time field to a number.', 'Error');
        return;
      }

      const time: TimeEntry = {
        length: parseFloat(timeForm.value.time),
        notes: timeForm.value.notes,
        projectId: timeForm.value.projectName,
        day: this.day
      };

      this.timeEntryService.createTimeEntry(time).subscribe((response: GenericResponseDTO) => {
        if(response.success){
          this.showLoadingSpinner = false;
          this.toastrService.success("Time entry successfully created", "Success");
          this.ref.close({ success: true, update: true, item: 'time entry' });
        }
      }, (err) => {
        this.showLoadingSpinner = false;
        this.toastrService.danger("There was an error creating the time entry", "Error");
      })
    }
  }

}
