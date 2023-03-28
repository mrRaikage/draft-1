import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgersTableComponent } from './ledgers-table.component';

describe('LedgersTabComponent', () => {
  let component: LedgersTableComponent;
  let fixture: ComponentFixture<LedgersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
