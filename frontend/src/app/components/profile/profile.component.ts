import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  faFolderPlus,
  faGear,
  faHouse,
  faInbox,
  faListCheck,
  faMagnifyingGlass,
  faPowerOff,
  faSquarePen,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { map, Observable } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { HomeworkService } from 'src/app/services/homework.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  revenueData$: Observable<any>;
  amountOfClassesForCurrentWeek$: Observable<any>;
  amountOfUnfinishedHomework$: Observable<any>;
  amountOfApplications$: Observable<any>;

  // User details
  isTeacher = false;
  username = '';

  // User photo
  photoUrl: any;

  // Hides content in home-page when offcanvas is opened on mobile
  @ViewChild('homeContent', { static: true }) homeContent!: ElementRef;

  // Icons
  icons = {
    house: faHouse,
    task: faListCheck,
    signOut: faPowerOff,
    folder: faFolderPlus,
    pen: faSquarePen,
    search: faMagnifyingGlass,
    settings: faGear,
    students: faUsers,
    applications: faInbox,
  };

  // Decides whether to show home page
  isHomePage = false;

  // Calendar settings
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    headerToolbar: {
      left: '',
      center: 'title',
      right: '',
    },
    initialView: 'timeGridDay',
    locale: 'uk',
    firstDay: 1,
    titleFormat: { day: 'numeric', month: 'long' },
    allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    nowIndicator: true,
    slotDuration: '01:00:00',
    height: 'auto',
  };

  // Chart settings
  chartOptions: any = {
    series: [
      {
        name: 'Сума',
        data: [],
      },
    ],
    chart: {
      height: 250,
      type: 'line',
      zoom: {
        enabled: false,
      },
      background: '#fff',
      toolbar: {
        show: false,
      },
    },
    title: {
      text: 'Дохід школи',
      align: 'left',
    },
    xaxis: {
      type: 'category',
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + ' ₴';
        },
      },
    },
    markers: {
      size: 5,
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value + ' ₴';
        },
      },
    },
    grid: {
      row: {
        colors: ['rgb(233, 233, 233)', 'white'],
        opacity: 0.5,
      },
    },
  };

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private applicationService: ApplicationService,
    private classesService: ClassesService,
    private homeworkService: HomeworkService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url == '/home';
    });

    this.authService.currentUser$.subscribe((user) => {
      // Check user role
      if (user.role === 'teacher') {
        this.isTeacher = true;
        this.revenueData$ =
          this.analyticsService.generateMonthlyRevenueReport();

        // Transform revenue data
        this.revenueData$
          .pipe(
            map((sales) =>
              sales.map((sale: any) => ({
                x: sale.month_year,
                y: sale.total_revenue,
              }))
            )
          )
          .subscribe((transformedData) => {
            this.chartOptions.series[0].data = transformedData;
          });

        this.amountOfApplications$ =
          this.applicationService.countAllApplications();
        this.amountOfClassesForCurrentWeek$ =
          this.classesService.countClassesForCurrentWeek();
        this.amountOfUnfinishedHomework$ =
          this.homeworkService.countUnfinishedHomework();
      } else {
        this.isTeacher = false;
      }

      this.userService.photoUrl$.subscribe((photoUrl) => {
        this.photoUrl = photoUrl;
      });

      // Load the current photo
      this.userService.getPhoto();

      // Get username
      this.username = user.name;
    });
  }

  ngAfterViewInit(): void {
    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        // Check if width is below a threshold, e.g., 400px
        if (width < 200) {
          // Perform actions when width is too small, e.g., apply styles to blend child elements
          this.homeContent.nativeElement.style.visibility = 'hidden';
        } else {
          // Reset styles when width is above the threshold
          this.homeContent.nativeElement.style.visibility = 'visible';
        }
      }
    });

    // Start observing the target div
    resizeObserver.observe(this.homeContent.nativeElement);
  }

  signOut() {
    this.authService.signOut();
  }

  changePage(page) {
    switch (page) {
      case 'Заявки':
        this.router.navigate(['/home/applications']);
        break;
      case 'Розклад':
        this.router.navigate(['/home/schedule']);
        break;
      case 'Всі завдання':
        this.router.navigate(['/home/tasks']);
        break;
    }
  }

  renderCalendar() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }

  // Used in template
  getCurrentUrl() {
    return this.router.url;
  }
}
