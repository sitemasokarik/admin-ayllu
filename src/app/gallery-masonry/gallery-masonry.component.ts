import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gallery-masonry',
  imports: [BreadcrumbComponent,CommonModule],
  templateUrl: './gallery-masonry.component.html',
  styleUrl: './gallery-masonry.component.css'
})
export class GalleryMasonryComponent {
  galleryImages = [
    'assets/images/gallery/gallery-img1.png',
    'assets/images/gallery/gallery-img2.png',
    'assets/images/gallery/gallery-img3.png',
    'assets/images/gallery/gallery-img4.png',
    'assets/images/gallery/gallery-img5.png',
    'assets/images/gallery/gallery-img6.png',
    'assets/images/gallery/gallery-img7.png',
    'assets/images/gallery/gallery-img8.png',
    'assets/images/gallery/gallery-img9.png',
    'assets/images/gallery/gallery-img10.png',
    'assets/images/gallery/gallery-img11.png',
    'assets/images/gallery/gallery-img12.png',
  ];

  // Repeat images if needed (as your original markup duplicated them)
  get repeatedGalleryImages() {
    return [...this.galleryImages, ...this.galleryImages];
  }
}
