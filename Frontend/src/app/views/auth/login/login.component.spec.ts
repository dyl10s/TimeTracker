import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { NbActionsModule, NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbSpinnerModule, NbStatusService } from '@nebular/theme';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { tokenGetter } from 'src/app/app.module';
import { AuthApiService } from 'src/app/core/services/auth/auth-api.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        AuthApiService,
        NbStatusService
      ],
      imports: [
        HttpClientModule, 
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter
          }
        }),
        AppRoutingModule,
        NbCardModule,
        NbLayoutModule,
        NbActionsModule,
        NbIconModule,
        NbButtonModule,
        FormsModule,
        ReactiveFormsModule,
        NbSpinnerModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call auth login method', async() => {
    let loginElement: DebugElement;
    const debugElement = fixture.debugElement;
    let authService = debugElement.injector.get(AuthApiService);
    let loginSpy = spyOn(authService, 'login').and.callThrough();

    loginElement = fixture.debugElement.query(By.css('form'));

    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('password');
    loginElement.triggerEventHandler('ngSubmit', null);
    expect(loginSpy).toHaveBeenCalledTimes(1);
  })
});
