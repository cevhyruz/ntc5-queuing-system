import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownDialogComponent } from './countdown-dialog.component';

describe('CountdownDialogComponent', () => {
  let component: CountdownDialogComponent;
  let fixture: ComponentFixture<CountdownDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountdownDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
