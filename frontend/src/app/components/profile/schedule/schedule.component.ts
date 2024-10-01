import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClassesService } from 'src/app/services/classes.service';
import { ClassDetailsDialogComponent } from './class-details-dialog/class-details-dialog.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  isUserTeacher = false;

  events$: Observable<any[]>;

  dialogData = {
    id: '',
    isCancelled: false,
    start: '',
    end: '',
    studentId: '',
    studentName: '',
    price: 300,
    isPaid: false,
    studentTimezone: '',
  };

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      timeGridPlugin,
      momentTimezonePlugin,
    ],
    eventClick: (arg) => {
      this.dialogData.id = arg.event.id;
      this.dialogData.isCancelled = arg.event._def.extendedProps['isCancelled'];
      this.dialogData.studentId = arg.event._def.extendedProps['studentId'];
      this.dialogData.studentName = arg.event._def.extendedProps['studentName'];
      this.dialogData.start = DateTime.fromJSDate(
        new Date(arg.event.start)
      ).toFormat("yyyy-MM-dd'T'HH:mm");
      this.dialogData.end = DateTime.fromJSDate(
        new Date(arg.event.end)
      ).toFormat("yyyy-MM-dd'T'HH:mm");
      this.dialogData.price = arg.event._def.extendedProps['price'];
      this.dialogData.isPaid = arg.event._def.extendedProps['isPaid'];
      this.dialogData.studentTimezone =
        arg.event._def.extendedProps['timezone'];

      let dialogRef = this.matDialog.open(ClassDetailsDialogComponent, {
        data: this.dialogData,
      });

      dialogRef.afterClosed().subscribe(() => this.ngOnInit());
    },
    editable: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridDay',
    locale: 'uk',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    },
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
        ? `<b>${formattedStartTime} - ${formattedEndTime}</b><br>${arg.event._def.extendedProps['studentName']}`
        : `<b>${formattedStartTime} - ${formattedEndTime}</b>`;

      return {
        html: title,
      };
    },
    firstDay: 1,
    titleFormat: { day: 'numeric', month: 'long' },
    allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    buttonText: {
      week: 'Тиждень',
      day: 'День',
    },
    nowIndicator: true,
    slotDuration: '00:30:00',
    height: 'auto',
    windowResize: function (arg) {
      if (window.innerWidth < 780) {
        this.changeView('timeGridDay', new Date());
      } else {
        this.changeView('timeGridWeek', new Date());
      }
    },
  };

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private classesService: ClassesService
  ) {}

  ngOnInit() {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    this.authService.currentUser$.subscribe((user) => {
      if (user.role === 'teacher') {
        this.isUserTeacher = true;
        this.events$ = this.classesService.getAllClasses().pipe(
          map((events) =>
            events.map((event) => ({
              ...event,
              start: DateTime.fromISO(event.start, { zone: event.timezone }) // Parse the time in student's timezone
                .setZone(user.timezone, { keepLocalTime: false }) // Convert to teacher's timezone
                .toISO(),
              end: DateTime.fromISO(event.end, { zone: event.timezone }) // Parse the time in student's timezone
                .setZone(user.timezone, { keepLocalTime: false }) // Convert to teacher's timezone
                .toISO(),
              isUserTeacher: this.isUserTeacher,
            }))
          )
        );
      } else {
        this.isUserTeacher = false;
        this.events$ = this.classesService.getClassesById(user.id);
      }

      // Set timezone for a calendar
      this.calendarOptions.timeZone = user.timezone;
    });
  }

  ngAfterViewInit() {
    this.onWindowResize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const weekButton = document.querySelector(
      '.fc-timeGridWeek-button'
    ) as HTMLElement;

    const dayButton = document.querySelector(
      '.fc-timeGridDay-button'
    ) as HTMLElement;

    const headerSection = document.querySelector(
      '.fc-header-toolbar'
    ) as HTMLElement;

    // Hide week btn for mobile screens & reverse for desktops
    if (window.innerWidth < 780) {
      [weekButton, dayButton].forEach((button) => {
        if (button) button.style.display = 'none';
      });

      if (headerSection) {
        headerSection.style.flexDirection = 'column-reverse';
        headerSection.style.gap = '10px';
      }
    } else {
      [weekButton, dayButton].forEach((button) => {
        if (button) button.style.display = '';
      });

      if (headerSection) headerSection.style.flexDirection = 'auto';
    }
  }

  openDialog() {
    this.matDialog.open(ClassDetailsDialogComponent, {
      data: this.dialogData,
    });
  }
}
