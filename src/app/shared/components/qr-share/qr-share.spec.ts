import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrShare } from './qr-share';

describe('QrShare', () => {
  let component: QrShare;
  let fixture: ComponentFixture<QrShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrShare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrShare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
