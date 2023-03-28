import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerPageComponent } from './ledgers.component';

describe('LedgerComponent', () => {
  let component: LedgerPageComponent;
  let fixture: ComponentFixture<LedgerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
