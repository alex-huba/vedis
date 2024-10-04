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
      content: string;
    }
  ) {}
}
