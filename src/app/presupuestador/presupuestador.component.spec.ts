import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestadorComponent } from './presupuestador.component';

describe('PresupuestadorComponent', () => {
  let component: PresupuestadorComponent;
  let fixture: ComponentFixture<PresupuestadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresupuestadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
