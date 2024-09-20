import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements AfterViewInit {
  @ViewChild('swiper')
  swiperRef: ElementRef;

  @ViewChild('nextBtnCarousel')
  nextBtnCarousel: ElementRef;

  @ViewChild('prevBtnCarousel')
  prevBtnCarousel: ElementRef;

  rightIconCarousel = faCircleChevronRight;
  leftIconCarousel = faCircleChevronLeft;

  // Configuring swiper
  ngAfterViewInit(): void {
    const swiperEl = document.querySelector('swiper-container');

    const params = {
      injectStyles: [
        `
      .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        opacity: 1;
        background: rgba(0, 0, 0, 0.2);
      }

      .swiper-pagination-bullet-active {
        background: #000D83;
      }

      .swiper-pagination {
        bottom: 0 !important;
      }
      `,
      ],
      pagination: {
        clickable: true,
      },
      grabCursor: true,
      breakpoints: {
        10: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        945: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1500: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
      on: {
        init: () => {
          const prevButton = this.prevBtnCarousel.nativeElement;
          prevButton.style.display = 'none';
        },
        slideChange: () => {
          const swiper = this.swiperRef.nativeElement.swiper;
          const prevButton = this.prevBtnCarousel.nativeElement;
          const nextButton = this.nextBtnCarousel.nativeElement;

          if (swiper.isBeginning) {
            prevButton.style.display = 'none';
          } else {
            prevButton.style.display = 'block';
          }

          if (swiper.isEnd) {
            nextButton.style.display = 'none';
          } else {
            nextButton.style.display = 'block';
          }
        },
      },
    };

    Object.assign(swiperEl, params);

    swiperEl.initialize();
  }

  // Configuring visibility of carousel btns
  toggleButtonVisibility() {
    const swiper = this.swiperRef.nativeElement.swiper;
    const prevButton = this.prevBtnCarousel.nativeElement;
    const nextButton = this.nextBtnCarousel.nativeElement;

    if (swiper.isBeginning) {
      prevButton.style.display = 'none';
    } else {
      prevButton.style.display = 'block';
    }

    if (swiper.isEnd) {
      nextButton.style.display = 'none';
    } else {
      nextButton.style.display = 'block';
    }
  }

  // Slide to prev slide in swiper
  prevSlide() {
    this.swiperRef?.nativeElement.swiper.slidePrev();
  }

  // Slide to next slide in swiper
  nextSlide() {
    this.swiperRef?.nativeElement.swiper.slideNext();
  }
}
