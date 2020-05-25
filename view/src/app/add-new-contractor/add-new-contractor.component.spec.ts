import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewContractorComponent } from './add-new-contractor.component';

describe('AddNewContractorComponent', () => {
  let component: AddNewContractorComponent;
  let fixture: ComponentFixture<AddNewContractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
