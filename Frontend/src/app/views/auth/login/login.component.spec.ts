import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { JwtModule } from '@auth0/angular-jwt';
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
      providers: [AuthApiService],
      imports: [
        HttpClientModule, 
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter
          }
        }),
        AppRoutingModule]
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
});
