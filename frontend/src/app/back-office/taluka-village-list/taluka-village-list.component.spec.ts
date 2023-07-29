import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalukaVillageListComponent } from './taluka-village-list.component';

describe('TalukaVillageListComponent', () => {
  let component: TalukaVillageListComponent;
  let fixture: ComponentFixture<TalukaVillageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalukaVillageListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalukaVillageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
