import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EnglishTestComponent } from './components/landing-tests/english-test/english-test.component';
import { GermanTestComponent } from './components/landing-tests/german-test/german-test.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { NewClassComponent } from './components/new-class/new-class.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { SignupComponent } from './components/signup/signup.component';
import { StudentsComponent } from './components/students/students.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TeacherGuardService } from './services/teacher-guard.service';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { DictionaryComponent } from './components/dictionary/dictionary.component';
import { NewWordComponent } from './components/new-word/new-word.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'english-test', component: EnglishTestComponent },
  { path: 'german-test', component: GermanTestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    component: HomeComponent,
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
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
