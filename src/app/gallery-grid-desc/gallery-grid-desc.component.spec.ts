import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryGridDescComponent } from './gallery-grid-desc.component';

describe('GalleryGridDescComponent', () => {
  let component: GalleryGridDescComponent;
  let fixture: ComponentFixture<GalleryGridDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryGridDescComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryGridDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
