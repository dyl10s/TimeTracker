/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { NbMenuModule, NbMenuService, NbTabsetModule, NbThemeModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { JwtService } from 'src/app/core/services/auth/jwt.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let mockJwtService = {
    decode() {
      return {
        given_name: "Test Name"
      }
    },
    isAuthenticated() {
      return true
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        NbThemeModule.forRoot({ name: 'dark' }).providers,
        NbMenuModule.forRoot().providers,
        RouterModule.forRoot([]).providers,
        { provide: JwtService, useValue: mockJwtService }
      ],
      imports: [
        NbMenuModule,
        BrowserAnimationsModule,
        NbTabsetModule,
        NbEvaIconsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
