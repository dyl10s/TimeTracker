import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';


@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  styles: [`
  :host nb-tab {
    padding: 1.25rem;
  }
  :host nb-tabset nav li {
    color: white;
  }
`],

})

export class NavbarComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

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
