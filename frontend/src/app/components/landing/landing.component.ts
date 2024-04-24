import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  faInstagram,
  faTelegram,
  faViber,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
  faArrowUpRightFromSquare,
  faCircleChevronLeft,
  faCircleChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { CountryISO } from 'ngx-intl-tel-input';
import { ContactInfo } from 'src/app/models/contact-info';
import { ContactService } from 'src/app/services/contact.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef;

  @ViewChild('nextBtnCarousel')
  nextBtnCarousel: ElementRef;

  @ViewChild('prevBtnCarousel')
  prevBtnCarousel: ElementRef;

  rightIconCarousel = faCircleChevronRight;
  leftIconCarousel = faCircleChevronLeft;

  preferredCountries: CountryISO[] = [
    CountryISO.Ukraine,
    CountryISO.Germany,
    CountryISO.Austria,
    CountryISO.Switzerland,
    CountryISO.UnitedKingdom,
    CountryISO.UnitedStates,
    CountryISO.Poland,
    CountryISO.CzechRepublic,
    CountryISO.Slovenia,
    CountryISO.Slovakia,
    CountryISO.Romania,
  ];

  contactForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-ЯїЇіІєЄґҐ']+$/)],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(5)],
    ],
    language: ['default', Validators.required],
    phone: [undefined, Validators.required],
    contactOption: 'default',
  });

  isSubmitted = false;
  baseUrl: string;

  blogArrow = faArrowUpRightFromSquare;

  viber = faViber;
  telegram = faTelegram;
  whatsapp = faWhatsapp;
  instagram = faInstagram;

  constructor(
    private ss: ScrollService,
    private fb: FormBuilder,
    private cs: ContactService
  ) {}

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
        1000: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1435: {
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

  ngOnInit(): void {
    var acc = document.getElementsByClassName('accordion');
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('faq-active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = 150 + 'px';
        }
      });
    }
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

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get language() {
    return this.contactForm.get('language');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get contactOption() {
    return this.contactForm.get('contactOption');
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
    } else {
      this.cs.sendData(this.contactForm.value as ContactInfo).subscribe();
    }
  }

  scrollToSection() {
    this.ss.scrollToElement('contact-form-section');
  }

  scrollToTop() {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
