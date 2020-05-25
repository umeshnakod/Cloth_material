import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEntryComponent } from './add-new-entry.component';

describe('AddNewEntryComponent', () => {
  let component: AddNewEntryComponent;
  let fixture: ComponentFixture<AddNewEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
