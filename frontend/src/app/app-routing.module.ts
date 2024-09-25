import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnglishTestComponent } from './components/landing-tests/english-test/english-test.component';
import { GermanTestComponent } from './components/landing-tests/german-test/german-test.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ApplicationsComponent } from './components/profile/applications/applications.component';
import { DictionaryComponent } from './components/profile/dictionary/dictionary.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScheduleComponent } from './components/profile/schedule/schedule.component';
import { TasksComponent } from './components/profile/tasks/tasks.component';
import { NewClassComponent } from './components/profile/teacher/new-class/new-class.component';
import { NewTaskComponent } from './components/profile/teacher/new-task/new-task.component';
import { NewWordComponent } from './components/profile/teacher/new-word/new-word.component';
import { StudentsComponent } from './components/profile/teacher/students/students.component';
import { UserSettingsComponent } from './components/profile/user-settings/user-settings.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TeacherGuardService } from './services/teacher-guard.service';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'english-test', component: EnglishTestComponent },
  { path: 'german-test', component: GermanTestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    component: ProfileComponent,
    children: [
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'tasks',
        component: TasksComponent,
      },
      {
        path: 'dictionary',
        component: DictionaryComponent,
      },
      {
        path: 'new-word',
        canActivate: [TeacherGuardService],
        component: NewWordComponent,
      },
      {
        path: 'new-task',
        canActivate: [TeacherGuardService],
        component: NewTaskComponent,
      },
      {
        path: 'new-class',
        canActivate: [TeacherGuardService],
        component: NewClassComponent,
      },
      {
        path: 'students',
        canActivate: [TeacherGuardService],
        component: StudentsComponent,
      },
      {
        path: 'settings',
        canActivate: [TeacherGuardService],
        component: UserSettingsComponent,
      },
      {
        path: 'applications',
        canActivate: [TeacherGuardService],
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
