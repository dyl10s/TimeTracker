import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-edit-time',
  templateUrl: './edit-time.component.html',
  styleUrls: ['./edit-time.component.scss']
})
export class EditTimeComponent {

  showLoadingSpinner: boolean = false;
  selectedItem = '0';

  EditTimeForm: FormGroup = new FormGroup({
    projectName: new FormControl(''),
    notes: new FormControl(''),
    time: new FormControl('')
  });

  constructor(
    private ref: NbDialogRef<EditTimeComponent>,
    private titleService: Title
  ) {
    this.titleService.setTitle("NTime - Edit Time");

    }

  closeDialog() {
    this.ref.close({ update: true });
  }

  editTimer() { }

}
