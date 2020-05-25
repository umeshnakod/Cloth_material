import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractorDetailsComponent } from './view-contractor-details.component';

describe('ViewContractorDetailsComponent', () => {
  let component: ViewContractorDetailsComponent;
  let fixture: ComponentFixture<ViewContractorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContractorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
