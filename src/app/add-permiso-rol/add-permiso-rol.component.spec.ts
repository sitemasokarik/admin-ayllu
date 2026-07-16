import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermisoRolComponent } from './add-permiso-rol.component';

describe('AddPermisoRolComponent', () => {
  let component: AddPermisoRolComponent;
  let fixture: ComponentFixture<AddPermisoRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPermisoRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPermisoRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
