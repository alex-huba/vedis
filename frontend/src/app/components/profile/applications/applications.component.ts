import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { ApplicationService } from 'src/app/services/application.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit {
  icons = {
    delete: faTrashCan,
  };

  applications$: Observable<any>;

  constructor(
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.applications$ = this.applicationService.getAllApplications();
  }

  deleteApplication(email) {
    this.applicationService.deleteApplicationByEmail(email).subscribe(() => {
      this.ngOnInit();
      this.snackBar.open('Заявку видалено', '👍', {
        duration: 5000,
      });
    });
  }
}
