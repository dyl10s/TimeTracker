import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {

  isMenuOpen: boolean = false;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {}

  hasRoute(route: string){
    return this.router.url.includes(route);
  }

  homeClick = function () {
    this.router.navigateByUrl('/home');
  }
  loginClick = function () {
    this.router.navigateByUrl('/auth/login');
  }
  signupClick = function () {
    this.router.navigateByUrl('/auth/register');
  }
  featuresClick = function () {
    this.router.navigateByUrl('/home');
  }
  integrationClick = function () {
    this.router.navigateByUrl('/home');
  }
  
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
