import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {

  isMenuOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}
  
  changeTab(event){
    switch(event.tabTitle) {
      case('Name'): 
        this.isMenuOpen = !this.isMenuOpen;
        break;
      default:
        break;
    };
  }

  deskItems: NbMenuItem[] = [
    {
      title: 'My Profile',
    },
    {
      title: 'Settings',
    },
    {
      title: 'Logout',
    }
  ];

  mobItems: NbMenuItem[] = [
    {
      title: "Menu",
      expanded: false,
      children: [
        {
          title: 'Time',
        },
        {
          title: 'Projects',
        },
        {
          title: 'Reports',
        },
        {
          title: 'Manage',
        },
        {
          title: 'Help',
        },
        {
          title: 'Name',
          expanded: false,
          children: [
            {
              title: 'My Profile',
            },
            {
              title: 'Settings',
            },
            {
              title: 'Logout',
            },
          ],
        },
      ],
    },
  ];



}
