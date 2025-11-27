import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home13Component } from './home-13.component';

describe('Home13Component', () => {
  let component: Home13Component;
  let fixture: ComponentFixture<Home13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home13Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
