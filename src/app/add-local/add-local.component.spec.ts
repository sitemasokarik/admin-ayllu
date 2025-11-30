import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocalComponent } from './add-local.component';

describe('AddLocalComponent', () => {
  let component: AddLocalComponent;
  let fixture: ComponentFixture<AddLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLocalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
