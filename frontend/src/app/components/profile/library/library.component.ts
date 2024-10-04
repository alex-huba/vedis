import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LibraryService } from 'src/app/services/library.service';
import { NewFileComponent } from './new-file/new-file.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  isUserTeacher = false;
  isFolderOpened = false;
  activeStudentId = '';

  generalCount$: Observable<any>;
  files$: Observable<any>;

  icons = {
    closedFolder: faFolder,
    openedFolder: faFolderOpen,
    add: faPlus,
  };

  constructor(
    private authService: AuthService,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isUserTeacher = user.role === 'teacher';

      if (this.isUserTeacher) {
        this.generalCount$ = this.libraryService.getCountOfFiles();
      } else {
        this.files$ = this.libraryService.getFileNamesByStudentId(user.id);
      }
    });
  }

  openFolder(studentId) {
    if (this.activeStudentId == studentId && this.isFolderOpened) {
      this.isFolderOpened = false;
      return;
    }

    this.activeStudentId = studentId;
    this.isFolderOpened = true;
    this.files$ = this.libraryService.getFileNamesByStudentId(studentId);
  }

  deleteFile(fileName) {
    this.libraryService
      .deleteFileByName(fileName, this.activeStudentId)
      .subscribe({
        next: () => {
          this.files$ = this.libraryService.getFileNamesByStudentId(
            this.activeStudentId
          );
          this.generalCount$ = this.libraryService.getCountOfFiles();
          this.snackBar.open('Файл видалено', '👍', {
            duration: 5000,
          });
        },
        error: () => {
          this.snackBar.open('Помилка', '👍', {
            duration: 5000,
          });
        },
      });
  }

  getFileLink(fileUrl: string): string {
    const token = localStorage.getItem('token');
    if (token) {
      // Append the token as a query parameter to the file URL
      return `${fileUrl}?token=${token}`;
    } else {
      // If no token, return the plain URL
      return fileUrl;
    }
  }

  openDialog() {
    this.matDialog
      .open(NewFileComponent)
      .afterClosed()
      .subscribe(() => {
        this.generalCount$ = this.libraryService.getCountOfFiles();
        this.isFolderOpened = false;
      });
  }
}
