import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { PayloadDTO } from 'src/app/core/models/auth/PayloadDto.model';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../core/services/auth/jwt.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  isMenuOpen: boolean = false;
  userInfo: PayloadDTO;

  constructor(
    public router: Router,
    public jwtService: JwtService,
    private nbMenuService: NbMenuService
  ) {
    this.nbMenuService.onItemClick().subscribe(menuItem => {
      if(menuItem.item.title == "Invite Discord Bot") {
        window.location.href = environment.discordLink;
      }
    })
  }

  ngOnInit(): void { }

  getFirstName(): string {
    this.userInfo = this.jwtService.decode();
    return this.userInfo?.given_name.replace(/ .*/, '');
  }

  routeCheck(route: string) {

    let url = this.router.url.split("?")[0];

    let check: boolean = true;
    // in app nav display //
    if (route == 'app') {
      if (!(url.includes('dashboard'))) {
        check = false;
      }
    }
    // home nav display //
    if (route == 'home') {
      if ((url.includes('dashboard'))) {
        check = false;
      }
    }
    // limited home nav display //
    if (route == 'logreg') {
      if (url.includes('register') || url.includes('login')) {
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
      route == "profile") {
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
      title: 'Invite Discord Bot'
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
      title: 'Profile',
      link: '/dashboard/profile'
    },
    {
      title: 'Invite Discord Bot'
    },
    {
      title: 'Logout',
      link: '/logout'
    },
  ];

}

