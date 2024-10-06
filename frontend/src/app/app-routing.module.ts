import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EnglishTestComponent } from './components/landing-tests/english-test/english-test.component';
import { GermanTestComponent } from './components/landing-tests/german-test/german-test.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ApplicationsComponent } from './components/profile/applications/applications.component';
import { ClassOverviewComponent } from './components/profile/class-overview/class-overview.component';
import { DictionaryComponent } from './components/profile/dictionary/dictionary.component';
import { LibraryComponent } from './components/profile/library/library.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScheduleComponent } from './components/profile/schedule/schedule.component';
import { StudentsComponent } from './components/profile/students/students.component';
import { TasksComponent } from './components/profile/tasks/tasks.component';
import { UserSettingsComponent } from './components/profile/user-settings/user-settings.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TeacherGuardService } from './services/teacher-guard.service';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'english-test', component: EnglishTestComponent },
  { path: 'german-test', component: GermanTestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot/password', component: ForgotPasswordComponent },
  { path: 'reset/password/:id/:token', component: ResetPasswordComponent },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    component: ProfileComponent,
    children: [
      {
        canActivate: [AuthGuardService],
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        canActivate: [AuthGuardService],
        path: 'tasks',
        component: TasksComponent,
      },
      {
        canActivate: [AuthGuardService],
        path: 'dictionary',
        component: DictionaryComponent,
      },
      {
        canActivate: [AuthGuardService],
        path: 'settings',
        component: UserSettingsComponent,
      },
      {
        canActivate: [AuthGuardService],
        path: 'overview',
        component: ClassOverviewComponent,
      },
      {
        canActivate: [AuthGuardService],
        path: 'library',
        component: LibraryComponent,
      },
      {
        canActivate: [TeacherGuardService],
        path: 'students',
        component: StudentsComponent,
      },
      {
        canActivate: [TeacherGuardService],
        path: 'applications',
        component: ApplicationsComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
