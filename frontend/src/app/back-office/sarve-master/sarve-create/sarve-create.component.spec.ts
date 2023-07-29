import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarveCreateComponent } from './sarve-create.component';

describe('SarveCreateComponent', () => {
  let component: SarveCreateComponent;
  let fixture: ComponentFixture<SarveCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SarveCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SarveCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
