import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbButtonGroupModule, NbDialogModule, NbDialogService, NbIconModule, NbSpinnerModule, NbThemeModule, NbToastrModule, NbToastrService, NbTreeGridModule, NbTreeGridService, NbTreeGridSortService } from '@nebular/theme';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { tokenGetter } from 'src/app/app.module';
import { AuthApiService } from 'src/app/core/services/auth/auth-api.service';
import { ProjectsComponent } from './projects.component';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('ProjectComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      providers: [AuthApiService, NbThemeModule.forRoot({ name: 'default' }).providers, NbDialogService],
      imports: [
        NbTreeGridModule,
        NbDialogModule.forRoot(),
        NbToastrModule.forRoot({
          duration: 7500,
          destroyByClick: true
        }),
        HttpClientModule, 
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter
          }
        }),
        AppRoutingModule,
        NbButtonGroupModule,
        NbIconModule,
        NbEvaIconsModule,
        NbSpinnerModule,
        HttpClientTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
