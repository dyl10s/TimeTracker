import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PayloadDTO } from 'src/app/core/models/auth/PayloadDto.model';
import { JwtService } from 'src/app/core/services/auth/jwt.service';

import { TimeEntryApiService } from '../../../core/services/timeEntry.api.service';

@Component({
  selector: 'app-protected-page',
  templateUrl: './protected-page.component.html',
  styleUrls: ['./protected-page.component.scss']
})
export class ProtectedPageComponent implements OnInit {

  user: PayloadDTO;

  constructor(
    private jwtService: JwtService
  ) { }

  ngOnInit() {
    this.user = this.jwtService.decode();
  }
}
