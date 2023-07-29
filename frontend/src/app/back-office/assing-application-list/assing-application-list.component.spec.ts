import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingApplicationListComponent } from './assing-application-list.component';

describe('AssingApplicationListComponent', () => {
  let component: AssingApplicationListComponent;
  let fixture: ComponentFixture<AssingApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssingApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
