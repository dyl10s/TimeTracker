import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { NbThemeModule, NbDialogService, NbDialogModule, NbActionsModule, NbButtonModule, NbDialogRef, NbMenuModule, NbIconModule, NbTabsetModule } from '@nebular/theme';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthApiService } from 'src/app/core/services/auth/auth-api.service';
import { CreateProjectComponent } from './create-project.component';

describe('CreateProjectComponent', () => {
  let component: CreateProjectComponent;
  let fixture: ComponentFixture<CreateProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateProjectComponent
      ],
      providers: [
        AuthApiService, 
        NbThemeModule.forRoot({ name: 'default' }).providers, 
        NbDialogService,
        NbDialogRef
      ],
      imports: [
        NbDialogModule.forRoot(),
        AppRoutingModule,
        NbActionsModule,
        FormsModule,
        ReactiveFormsModule,
        NbButtonModule,
        NbMenuModule.forRoot(),
        NbIconModule,
        NbTabsetModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
