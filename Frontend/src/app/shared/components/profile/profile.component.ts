import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { NbMenuItem } from '@nebular/theme';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private sidebarService: NbSidebarService) {
  }

  ngOnInit(): void {
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  items: NbMenuItem[] = [
    {
      title: 'Basic Info',
    },
    {
      title: 'Projects',
    },
    {
      title: 'Notifications',
    }
  ];

}
