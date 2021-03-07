import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { NbThemeModule, NbDialogRef, NbToastrModule, NbActionsModule, NbButtonModule, NbSpinnerModule, NbCardModule, NbMenuService } from '@nebular/theme';
import { tokenGetter } from 'src/app/app.module';
import { CreateProjectComponent } from './create-project.component';

/* 
  Create a mock class since we don't have the real dialog
  and the component is expecting it in the constructor
*/
export class NbDialogMock {
  open() {
    return;
  }

  close() {
    return;
  }
}

describe('CreateProjectComponent', () => {
  let component: CreateProjectComponent;
  let fixture: ComponentFixture<CreateProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateProjectComponent
      ],
      providers: [
        NbThemeModule.forRoot({ name: 'default' }).providers, 
        { provide: NbDialogRef, useClass: NbDialogMock }
      ],
      imports: [
        HttpClientModule,
        NbToastrModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        NbActionsModule,
        NbButtonModule,
        NbSpinnerModule,
        NbCardModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter
          }
        }),
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
