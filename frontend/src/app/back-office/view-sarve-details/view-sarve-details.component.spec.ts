import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSarveDetailsComponent } from './view-sarve-details.component';

describe('ViewSarveDetailsComponent', () => {
  let component: ViewSarveDetailsComponent;
  let fixture: ComponentFixture<ViewSarveDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSarveDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSarveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
