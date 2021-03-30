import { Component, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  body: string;

  @Output()
  yesClicked: CallableFunction;

  @Output()
  noClicked: CallableFunction;

  constructor(private ref: NbDialogRef<YesNoDialogComponent>) { }

  ngOnInit(): void {
  }

  no() {
    if(this.noClicked) {
      this.noClicked();
    }
    
    this.ref.close();
  }

  yes() {
    if(this.yesClicked) {
      this.yesClicked();
    }
    
    this.ref.close();
  }

}
