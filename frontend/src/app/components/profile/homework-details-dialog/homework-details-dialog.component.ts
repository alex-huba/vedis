import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-homework-details-dialog',
  templateUrl: './homework-details-dialog.component.html',
  styleUrls: ['./homework-details-dialog.component.css'],
})
export class HomeworkDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      studentName: string;
      email: string;
      dueDate: string;
      status: string;
      content: string;
    }
  ) {}

  parseTimestamp(date: string) {
    const parsedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Kiev',
    };

    return parsedDate.toLocaleDateString('uk-UA', options);
  }
}
