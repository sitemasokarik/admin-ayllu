import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home12Component } from './home-12.component';

describe('Home12Component', () => {
  let component: Home12Component;
  let fixture: ComponentFixture<Home12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home12Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
