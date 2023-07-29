import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApplicationListComponent } from './all-application-list.component';

describe('AllApplicationListComponent', () => {
  let component: AllApplicationListComponent;
  let fixture: ComponentFixture<AllApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
