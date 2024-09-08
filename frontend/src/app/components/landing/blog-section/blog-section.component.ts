import { Component } from '@angular/core';
import {
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.css']
})
export class BlogSectionComponent {
  blogArrow = faArrowUpRightFromSquare;

}
