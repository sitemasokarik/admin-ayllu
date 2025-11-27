import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home15Component } from './home-15.component';

describe('Home15Component', () => {
  let component: Home15Component;
  let fixture: ComponentFixture<Home15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home15Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
