import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
@Component({
  selector: 'app-create-time',
  templateUrl: './create-time.component.html',
  styleUrls: ['./create-time.component.scss']
})
export class CreateTimeComponent {

  showLoadingSpinner: boolean = false;
  selectedItem = '0';

  createTimeForm: FormGroup = new FormGroup({
    projectName: new FormControl(''),
    notes: new FormControl(''),
    time: new FormControl('')
  });

  constructor(private ref: NbDialogRef<CreateTimeComponent>
  ) { }

  closeDialog() {
    this.ref.close({ update: true });
  }

  startTimer() { }

}
