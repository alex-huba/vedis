import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  faCalendarDays,
  faClockRotateLeft,
  faFolderOpen,
  faGear,
  faHouse,
  faInbox,
  faListCheck,
  faMagnifyingGlass,
  faPlusCircle,
  faPowerOff,
  faSpellCheck,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { HomeworkService } from 'src/app/services/homework.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  revenueData$: Observable<any>;
  amountOfClassesForCurrentWeek = 0;
  amountOfUnfinishedHomework: 0;
  amountOfNewApplications = 0;
  dictionaryLength = 0;

  // User details
  userDetail = {
    isTeacher: false,
    username: '',
    timezone: '',
    photoUrl: null,
  };

  // Hides content in home-page when offcanvas is opened on mobile
  @ViewChild('homeContent', { static: true }) homeContent!: ElementRef;
  @ViewChild('homeContentStudent', { static: true })
  homeContentStudent!: ElementRef;

  // Icons
  icons = {
    house: faHouse,
    task: faListCheck,
    signOut: faPowerOff,
    search: faMagnifyingGlass,
    settings: faGear,
    students: faUsers,
    applications: faInbox,
    overview: faClockRotateLeft,
    calendar: faCalendarDays,
    add: faPlusCircle,
    library: faFolderOpen,
    dictionary: faSpellCheck,
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
    editable: false,
    initialView: 'timeGridDay',
    locale: 'uk',
    titleFormat: { day: 'numeric', month: 'long' },
    allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    nowIndicator: true,
    slotDuration: '01:00:00',
    height: 'auto',
    eventContent: function (arg) {
      // Create new Date objects for the event's start and end times
      const startDate = new Date(arg.event.start);
      const endDate = new Date(arg.event.end);

      // Format the start time as HH:MM
      const startHours = String(startDate.getHours()).padStart(2, '0'); // Pad with leading 0
      const startMinutes = String(startDate.getMinutes()).padStart(2, '0'); // Pad with leading 0
      const formattedStartTime = `${startHours}:${startMinutes}`;

      // Format the end time as HH:MM
      const endHours = String(endDate.getHours()).padStart(2, '0'); // Pad with leading 0
      const endMinutes = String(endDate.getMinutes()).padStart(2, '0'); // Pad with leading 0
      const formattedEndTime = `${endHours}:${endMinutes}`;

      // Customize the display of the event
      let title = arg.event._def.extendedProps['isUserTeacher']
        ? `<b>${formattedStartTime} - ${formattedEndTime}</b> ${arg.event._def.extendedProps['studentName']}`
        : `<b>${formattedStartTime} - ${formattedEndTime}</b>`;

      return {
        html: title,
      };
    },
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
      align: 'center',
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

  isLoaded = {
    userPhoto: false,
    newApplications: false,
    classesOnThisWeek: false,
    dueHomework: false,
    dictionaryLength: false,
  };

  events$: Observable<any[]>;

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private applicationService: ApplicationService,
    private classesService: ClassesService,
    private homeworkService: HomeworkService,
    private dictionaryService: DictionaryService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url == '/home';
    });

    this.authService.currentUser$.subscribe((user) => {
      this.userDetail.isTeacher = user.role == 'teacher';
      this.userDetail.timezone = user.timezone;

      if (user.role === 'teacher') {
        // Get revenue data
        this.analyticsService
          .generateMonthlyRevenueReport()
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

        // Get amount of new applications
        this.applicationService.countAllApplications().subscribe((amount) => {
          this.amountOfNewApplications = amount;
          this.isLoaded.newApplications = true;
        });
      } else {
        // Get amount of words in dictionary
        this.dictionaryService.getAmountById(user.id).subscribe((data) => {
          this.dictionaryLength = data;
          this.isLoaded.dictionaryLength = true;
        });
      }

      // Get classes for today
      this.events$ = this.classesService.getAllClassesForToday(user.id).pipe(
        map((events) =>
          events.map((event) => ({
            ...event,
            start: DateTime.fromISO(event.start, { zone: event.timezone }) // Parse the time in student's timezone
              .setZone(user.timezone, { keepLocalTime: false }) // Convert to teacher's timezone
              .toISO(),
            end: DateTime.fromISO(event.end, { zone: event.timezone }) // Parse the time in student's timezone
              .setZone(user.timezone, { keepLocalTime: false }) // Convert to teacher's timezone
              .toISO(),
            isUserTeacher: this.userDetail.isTeacher,
          }))
        )
      );

      // Get amount of unfinished homework
      this.homeworkService
        .countUnfinishedHomework(user.id)
        .subscribe((amount) => {
          this.amountOfUnfinishedHomework = amount;
          this.isLoaded.dueHomework = true;
        });

      // Get amount of classes for current week
      this.classesService
        .countClassesForCurrentWeek(user.id)
        .subscribe((amount) => {
          this.amountOfClassesForCurrentWeek = amount;
          this.isLoaded.classesOnThisWeek = true;
        });

      // Get user photo
      this.userService.photoUrl$.subscribe((photoUrl) => {
        if (photoUrl) {
          this.userDetail.photoUrl = photoUrl;
          this.isLoaded.userPhoto = true;
        }
      });

      this.userDetail.username = user.name;
    });
  }

  ngAfterViewInit() {
    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        // Check if width is below a threshold, e.g., 400px
        if (width < 200) {
          // Perform actions when width is too small, e.g., apply styles to blend child elements
          if (this.homeContent)
            this.homeContent.nativeElement.style.visibility = 'hidden';

          if (this.homeContentStudent)
            this.homeContentStudent.nativeElement.style.visibility = 'hidden';
        } else {
          // Reset styles when width is above the threshold
          if (this.homeContent)
            this.homeContent.nativeElement.style.visibility = 'visible';

          if (this.homeContentStudent)
            this.homeContentStudent.nativeElement.style.visibility = 'visible';
        }
      }
    });

    // Start observing the target div
    if (this.homeContent)
      resizeObserver.observe(this.homeContent.nativeElement);

    if (this.homeContentStudent)
      resizeObserver.observe(this.homeContentStudent.nativeElement);
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['']);
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
