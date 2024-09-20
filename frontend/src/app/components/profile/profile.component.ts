import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  faFolderPlus,
  faHouse,
  faListCheck,
  faMagnifyingGlass,
  faPowerOff,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private url = 'http://localhost:3001/post';
  posts$: Observable<any[]>;

  // User details
  isTeacher = false;
  username = '';

  houseIcon = faHouse;
  taskIcon = faListCheck;
  turnOffIcon = faPowerOff;
  folderIcon = faFolderPlus;
  penIcon = faSquarePen;
  glassIcon = faMagnifyingGlass;

  isHomePage = false;

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

  salesData = [
    { date: '01.2024', sum: 2000 },
    { date: '02.2024', sum: 4000 },
    { date: '03.2024', sum: 1500 },
    { date: '04.2024', sum: 1500 },
    { date: '05.2024', sum: 2500 },
    { date: '06.2024', sum: 3500 },
    { date: '07.2024', sum: 1500 },
    { date: '08.2024', sum: 2500 },
    { date: '09.2024', sum: 3500 },
    { date: '10.2024', sum: 500 },
    { date: '11.2024', sum: 50 },
    { date: '12.2024', sum: 1500 },
  ];
  chartOptions: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url == '/home';
    });

    const transformedData = this.salesData.map((sale) => ({
      x: sale.date,
      y: sale.sum,
    }));
    this.chartOptions = {
      series: [
        {
          name: 'Сума',
          data: transformedData,
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
  }

  ngOnInit(): void {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    this.posts$ = this.fetchAll();
    this.authService.currentUser$.subscribe((user) => {
      // Check user role
      if (user.role === 'teacher') {
        this.isTeacher = true;
      } else {
        this.isTeacher = false;
      }

      // Get username
      this.username = user.name;
    });
  }

  fetchAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { responseType: 'json' });
  }

  signOut() {
    this.authService.signOut();
  }

  renderCalendar() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }
}
