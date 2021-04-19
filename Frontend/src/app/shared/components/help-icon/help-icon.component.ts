import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NbAdjustment, NbPopoverDirective } from '@nebular/theme';

@Component({
  selector: 'app-help-icon',
  templateUrl: './help-icon.component.html',
  styleUrls: ['./help-icon.component.scss']
})
export class HelpIconComponent implements OnInit {

  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  @HostListener('window:resize')
  onResize() {
    this.adjustPopover();
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.popover.nbPopoverShowStateChange.subscribe(state => this.adjustPopover());
  }

  adjustPopover() {
    if(this.popover.isShown) {
      let popoverElement = document.querySelector("nb-popover") as any;
      let overlayElement = document.querySelector("#popoverStyle .cdk-overlay-pane") as any;
      let arrowElement = document.querySelector("#popoverStyle .arrow") as any;

      overlayElement.style.marginLeft = overlayElement.style.right;

      if(window.innerWidth < 660) {
        popoverElement.style.overflowY = "auto";
        popoverElement.style.width = "100%";
        popoverElement.style.position = "fixed";
        popoverElement.style.left = "0px";
        popoverElement.style.right = "0px";
        popoverElement.style.bottom = "80px";
        popoverElement.style.top = "0px";
        overlayElement.style.width = "100%";
        arrowElement.style.display = "none";
      } else {
        popoverElement.style.overflowY = "initial";
        popoverElement.style.width = "initial";
        popoverElement.style.position = "initial";
        popoverElement.style.top = "initial";
        popoverElement.style.left = "initial;";
        popoverElement.style.right = "initial";
        popoverElement.style.bottom = "initial";
        overlayElement.style.width = "initial";
        arrowElement.style.display = "initial";
      }

      let popupChanged = false;
      if(window.innerWidth < 660) {
        if(this.popover.adjustment !== NbAdjustment.NOOP) {
          this.popover.adjustment = NbAdjustment.NOOP;
          this.popover.offset = 0;
          popupChanged = true;
        }
      } else {
        if(this.popover.adjustment === NbAdjustment.NOOP) {
          this.popover.adjustment = NbAdjustment.CLOCKWISE;
          this.popover.offset = 15;
          popupChanged = true;
        }
      }
      if(popupChanged = true)
        this.popover.rebuild();
    }
  }
}
