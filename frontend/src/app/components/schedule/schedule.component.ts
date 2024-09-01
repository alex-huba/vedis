import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SchoolService } from 'src/app/services/school.service';
import { ClassDetailsDialogComponent } from '../class-details-dialog/class-details-dialog.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  isUserTeacher = false;
  userId = '';

  students$: Observable<any[]>;

  events$: Observable<any[]>;

  dialogData = {
    classId: '',
    studentName: '',
    classStatus: '',
    studentId: '',
    classStart: undefined,
    classEnd: undefined,
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    eventClick: (arg) => {
      this.dialogData.classId = arg.event._def.publicId;
      this.dialogData.studentName = arg.event._def.title;
      this.dialogData.classStatus = arg.event._def.extendedProps['status'];
      this.dialogData.studentId = arg.event._def.extendedProps['studentId'];
      this.dialogData.classStart = arg.event.start;
      this.dialogData.classEnd = arg.event.end;

      let dialogRef = this.matDialog.open(ClassDetailsDialogComponent, {
        data: this.dialogData,
      });

      dialogRef.afterClosed().subscribe((res) => {
        this.ngOnInit();
      });
    },
    editable: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridDay',
    locale: 'uk',
    firstDay: 1,
    titleFormat: { day: 'numeric', month: 'long' },
    allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '23:00:00',
    buttonText: {
      week: 'Тиждень',
      day: 'День',
    },
    nowIndicator: true,
    slotDuration: '00:30:00',
    height: 'auto',
    windowResize: function (arg) {
      if (window.innerWidth < 451) {
        this.changeView('timeGridDay', new Date());
      } else {
        this.changeView('timeGridWeek', new Date());
      }
    },
  };

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private ss: SchoolService
  ) {}

  ngOnInit(): void {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);

    this.authService.currentUser$.subscribe((user) => {
      if (user.role === 'teacher') {
        this.isUserTeacher = true;
        this.students$ = this.ss.getAllStudents();
        this.events$ = this.ss.getAllClasses();
      } else {
        this.isUserTeacher = false;
        this.userId = user.id;
        this.events$ = this.ss.getClassesById(this.userId);
      }
    });
  }

  ngAfterViewInit(): void {
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
    if (window.innerWidth < 451) {
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
    let currentDialog = this.matDialog.open(ClassDetailsDialogComponent, {
      data: this.dialogData,
    });
  }
}
