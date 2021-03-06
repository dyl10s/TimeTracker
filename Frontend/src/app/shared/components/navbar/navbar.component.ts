import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  isMenuOpen: boolean = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { }

  routeCheck(route: string) {
    let check: boolean = true;
    // no nav display for login components //
    if (this.router.url.includes('register') ||
      this.router.url.includes('login')) {
      check = false;
    }
    // in app nav display //
    if (route == 'app') {
      if (!(this.router.url.includes('dashboard'))) {
        check = false;
      }
    }
    // home nav display //
    if (route == 'home') {
      if ((this.router.url.includes('dashboard'))) {
        check = false;
      }
    }
    return check;
  }

  routeClick(route: string) {
    if (route == '') {
      this.router.navigateByUrl('');
    }
    else if (route == 'login' || route == "register") {
      this.router.navigateByUrl('/auth/' + route);
    }

    else if (route == 'time' ||
      route == "projects" ||
      route == "reports" ||
      route == "manage" ||
      route == "profile" ||
      route == "help" ||
      route == "settings") {
      this.router.navigateByUrl('/dashboard/' + route);
    }
    else if (route == 'logout') {
      this.router.navigateByUrl('/logout');
    }
  }

  homeItems = [
    {
      title: 'Login',
      link: '/auth/login'
    },
    {
      title: 'Sign Up',
      link: '/auth/register'
    },
  ];

  deskAppItems = [
    {
      title: 'Profile',
      link: '/dashboard/profile'
    },
    {
      title: 'Help',
      link: '/dashboard/help'
    },
    {
      title: 'Settings',
      link: '/dashboard/settings'
    },
    {
      title: 'Logout',
      link: '/logout'
    },
  ];

  mobAppItems = [
    {
      title: 'Time',
      link: '/dashboard/time'
    },
    {
      title: 'Projects',
      link: '/dashboard/projects'
    },
    {
      title: 'Reports',
      link: '/dashboard/reports'
    },
    {
      title: 'Manage',
      link: '/dashboard/manage'
    },
    {
      title: 'Profile',
      link: '/dashboard/profile'
    },
    {
      title: 'Help',
      link: '/dashboard/help'
    },
    {
      title: 'Settings',
      link: '/dashboard/settings'
    },
    {
      title: 'Logout',
      link: '/logout'
    },
  ];



}
