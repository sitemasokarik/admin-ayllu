import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrolComponent } from './addrol.component';

describe('AddrolComponent', () => {
  let component: AddrolComponent;
  let fixture: ComponentFixture<AddrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddrolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
