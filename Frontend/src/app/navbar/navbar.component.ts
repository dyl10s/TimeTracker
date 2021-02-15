import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']

})

export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tabs: any[] = [
    {
      title: 'Users',
      icon: 'person',
      route: './tab1',
    },
    {
      title: 'Orders',
      icon: 'paper-plane-outline',
      responsive: true,
      route: [ './tab2' ],
    },
    {
      title: 'Transaction',
      icon: 'flash-outline',
      responsive: true,
      disabled: true,
    },
  ];

  deskItems: NbMenuItem[] = [
    {
      title: 'My Profile',
      expanded: true,
    },
    {
      title: 'Settings',
      expanded: true,
    },
    {
      title: 'Logout',
      expanded: true,
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
