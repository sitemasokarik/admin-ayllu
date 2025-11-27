import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild, ElementRef
} from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements AfterViewInit {
  title = 'Carousels';

  @ViewChild('defaultCarousel', { static: false }) defaultCarousel!: ElementRef;
  @ViewChild('arrowCarousel', { static: false }) arrowCarousel!: ElementRef;
  @ViewChild('paginationCarousel', { static: false }) paginationCarousel!: ElementRef;
  @ViewChild('progressCarousel', { static: false }) progressCarousel!: ElementRef;
  @ViewChild('multipleCarousel', { static: false }) multipleCarousel!: ElementRef;
  sliderTimer: number = 5000; // 5 seconds
  beforeEnd: number = 500; // 0.5 seconds before transition


  defaultSlider = [
    {
      image: 'assets/images/carousel/carousel-img1.png',
      title: 'Carousel Slide One',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img2.png',
      title: 'Carousel Slide Two',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img3.png',
      title: 'Carousel Slide Three',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    }
  ];

  arrowSlides = [
    {
      image: 'assets/images/carousel/carousel-img2.png',
      title: 'Carousel Slide One',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img4.png',
      title: 'Carousel Slide Two',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img3.png',
      title: 'Carousel Slide Three',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    }
  ];

  slides = [
    { image: 'assets/images/carousel/carousel-img4.png', title: 'Carousel Slide One', desc: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when' },
    { image: 'assets/images/carousel/carousel-img2.png', title: 'Carousel Slide Two', desc: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when' },
    { image: 'assets/images/carousel/carousel-img3.png', title: 'Carousel Slide Three', desc: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when' },
    { image: 'assets/images/carousel/carousel-img1.png', title: 'Carousel Slide Four', desc: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when' }
  ];

  progressSlideConfig = {
    autoplay: true,
    autoplaySpeed: this.sliderTimer,
    speed: 1000,
    arrows: false,
    dots: false,
    adaptiveHeight: true,
    pauseOnFocus: false,
    pauseOnHover: false
  };

  paginationSlides = [
    {
      image: 'assets/images/carousel/carousel-img3.png',
      title: 'Carousel Slide One',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img4.png',
      title: 'Carousel Slide Two',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img1.png',
      title: 'Carousel Slide Three',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    },
    {
      image: 'assets/images/carousel/carousel-img2.png',
      title: 'Carousel Slide Four',
      description: 'User Interface (UI) and User Experience (UX) Design play key roles in the experience users have when'
    }
  ];

  multipleSlides = [
    'assets/images/carousel/mutiple-carousel-img1.png',
    'assets/images/carousel/mutiple-carousel-img2.png',
    'assets/images/carousel/mutiple-carousel-img3.png',
    'assets/images/carousel/mutiple-carousel-img4.png',
    'assets/images/carousel/mutiple-carousel-img2.png'
  ];

  ngAfterViewInit(): void {

    new Swiper(this.defaultCarousel.nativeElement, {
      loop: true,
      speed: 600,
      autoplay: false,
      effect: 'fade', // Optional: adds fade transition between slides
      // Add more configurations as needed
    });

    new Swiper(this.arrowCarousel.nativeElement, {
      modules: [Navigation],
      loop: true,
      speed: 600,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // Add more configurations as needed
    });

    new Swiper(this.paginationCarousel.nativeElement, {
      modules: [Pagination],
      loop: true,
      speed: 600,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active'
      },
      // Add more configurations as needed
    });

    new Swiper(this.multipleCarousel.nativeElement, {
      modules: [Pagination],
      loop: true,
      speed: 600,
      slidesPerView: 4,
      spaceBetween: 16, // matches your mx-8 (8px on each side)
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 8
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 12
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 16
        }
      }
    });


    const swiper = new Swiper(this.progressCarousel.nativeElement, {
      modules: [Autoplay],
      autoplay: {
        delay: this.sliderTimer,
        disableOnInteraction: false,
      },
      speed: 1000,
      loop: true,
      on: {
        init: () => this.startProgressBar(),
        slideChangeTransitionStart: () => {
          this.startProgressBar();
          this.animateTitle();
        },
        slideChangeTransitionEnd: () => {
          // Additional logic if needed
        }
      }
    });
  }

  animateTitle() {
    setTimeout(() => {
      const activeSlide = document.querySelector('.swiper-slide-active');
      if (activeSlide) {
        const title = activeSlide.querySelector('h5');
        if (title) {
          title.classList.add('show');
          setTimeout(() => title.classList.remove('show'), this.sliderTimer - this.beforeEnd);
        }
      }
    });
  }

  startProgressBar() {
    const progress = document.querySelector('.slider-progress span') as HTMLElement;
    if (progress) {
      progress.style.transition = 'none';
      progress.style.width = '0';
      progress.classList.remove('active');

      setTimeout(() => {
        progress.style.transition = `width ${this.sliderTimer / 1000}s linear`;
        progress.style.width = '100%';
        progress.classList.add('active');
      }, 100);
    }
  }

}

