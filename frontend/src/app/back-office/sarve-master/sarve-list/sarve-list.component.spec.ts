import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarveListComponent } from './sarve-list.component';

describe('SarveListComponent', () => {
  let component: SarveListComponent;
  let fixture: ComponentFixture<SarveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
