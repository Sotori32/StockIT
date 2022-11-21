import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageMobileComponent } from './storage-mobile.component';

describe('StorageMobileComponent', () => {
  let component: StorageMobileComponent;
  let fixture: ComponentFixture<StorageMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
