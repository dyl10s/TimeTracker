import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  homeClick = function () {
    this.router.navigateByUrl('/dashboard/home');
  }
  featuresClick = function () {
    this.router.navigateByUrl('/dashboard/home');
  }
  integrationClick = function () {
    this.router.navigateByUrl('/dashboard/home');
  }

}
