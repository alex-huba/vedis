import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpFromBracket,
  faCircleCheck,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { CountryISO } from 'ngx-intl-tel-input';
import { preferredCountries } from 'src/app/models/preferredCountriesPhone';
import { timezones } from 'src/app/models/timezones';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent implements OnInit {
  icons = {
    delete: faTrashCan,
    upload: faArrowUpFromBracket,
    edit: faWandMagicSparkles,
    done: faCircleCheck,
  };

  preferredCountries: CountryISO[] = preferredCountries;

  // Form fields w/ user info
  detailsForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Zа-яА-ЯїЇіІєЄґҐ ']+$/),
      ],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.minLength(5)],
    ],
    phone: [undefined, Validators.required],
    role: '',
    timezone: ['', Validators.required],
  });

  // Disables/enables input fields
  isEditMode = false;

  // Upload photo input
  selectedFile: File | null = null;

  // User photo
  photoUrl: any;

  // List of 24 major timezones
  timezones = timezones;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.detailsForm.disable();
    this.authService.currentUser$.subscribe((user) => {
      this.detailsForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
        timezone: user.timezone,
      });
    });

    // Subscribe to photo updates
    this.userService.photoUrl$.subscribe((photoUrl) => {
      this.photoUrl = photoUrl;
    });

    // Load the current photo
    this.userService.getPhoto();
  }

  get name() {
    return this.detailsForm.get('name');
  }

  get email() {
    return this.detailsForm.get('email');
  }

  get phone() {
    return this.detailsForm.get('phone');
  }

  get role() {
    return this.detailsForm.get('role');
  }

  get timezone() {
    return this.detailsForm.get('timezone');
  }

  changeEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.detailsForm.enable();
    } else {
      this.detailsForm.disable();
    }
  }

  onSubmit() {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
    } else {
      this.userService.updateProfileData(this.detailsForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Дані оновлено', '👍', {
            duration: 15000,
          });
          this.changeEditMode();
          localStorage.setItem('token', res.token);
          this.authService.updateUserDetails(res.user);
        },
        error: () => {
          this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
            duration: 5000,
          });
        },
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('photo', this.selectedFile);

      this.userService.uploadPhoto(formData).subscribe({
        next: () => {
          this.userService.getPhoto();
          this.snackBar.open('Фото оновлено', '👍', {
            duration: 15000,
          });
        },
        error: () => {
          this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
            duration: 5000,
          });
        },
      });
    } else {
      console.error('No file selected.');
    }
  }

  deletePhoto() {
    this.userService.deletePhoto().subscribe({
      next: () => {
        this.userService.getPhoto();
        this.snackBar.open('Фото видалено', '👍', {
          duration: 15000,
        });
      },
      error: () => {
        this.snackBar.open('Щось пішло не так. Спробуйте ще раз', '👍', {
          duration: 5000,
        });
      },
    });
  }
}
