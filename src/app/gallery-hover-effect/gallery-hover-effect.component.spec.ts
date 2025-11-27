import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryHoverEffectComponent } from './gallery-hover-effect.component';

describe('GalleryHoverEffectComponent', () => {
  let component: GalleryHoverEffectComponent;
  let fixture: ComponentFixture<GalleryHoverEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryHoverEffectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryHoverEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
