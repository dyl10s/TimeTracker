import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbThemeModule, NbDialogRef, NbToastrModule } from '@nebular/theme';
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

  beforeEach(waitForAsync(() => {
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
        NbToastrModule.forRoot()
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
