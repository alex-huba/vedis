import { Component } from '@angular/core';
import {
  faInstagram,
  faTelegram,
  faViber,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-socials-section',
  templateUrl: './socials-section.component.html',
  styleUrls: ['./socials-section.component.css'],
})
export class SocialsSectionComponent {
  viber = faViber;
  telegram = faTelegram;
  whatsapp = faWhatsapp;
  instagram = faInstagram;
}
