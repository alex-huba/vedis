import { Component } from '@angular/core';
import {
  faViber,
  faTelegram,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css'],
})
export class SocialMediaComponent {
  viber = faViber;
  telegram = faTelegram;
  instagram = faInstagram;
}
