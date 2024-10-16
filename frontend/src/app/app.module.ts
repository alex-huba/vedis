import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// Services
import { InterceptorService } from './services/interceptor.service';

// Swiper.js
import { register } from 'swiper/element/bundle';
register();

// Font awesome icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Phone number validator
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

// Angular material components
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// FullCalendar library
import { FullCalendarModule } from '@fullcalendar/angular';

// Ngx text editor library
import { NgxSimpleTextEditorModule } from 'ngx-simple-text-editor';

// Charts in profile
import { NgApexchartsModule } from 'ng-apexcharts';

// Pagination in class overview
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EnglishTestComponent } from './components/landing-tests/english-test/english-test.component';
import { GermanTestComponent } from './components/landing-tests/german-test/german-test.component';
import { AboutComponent } from './components/landing/about/about.component';
import { BenefitsComponent } from './components/landing/benefits/benefits.component';
import { BlogComponent } from './components/landing/blog/blog.component';
import { ClientFormComponent } from './components/landing/client-form/client-form.component';
import { CoursesComponent } from './components/landing/courses/courses.component';
import { FaqComponent } from './components/landing/faq/faq.component';
import { IntroComponent } from './components/landing/intro/intro.component';
import { LandingComponent } from './components/landing/landing.component';
import { LevelCheckComponent } from './components/landing/level-check/level-check.component';
import { SocialMediaComponent } from './components/landing/social-media/social-media.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ApplicationsComponent } from './components/profile/applications/applications.component';
import { ClassOverviewComponent } from './components/profile/class-overview/class-overview.component';
import { NewClassComponent } from './components/profile/class-overview/new-class/new-class.component';
import { DictionaryComponent } from './components/profile/dictionary/dictionary.component';
import { NewWordComponent } from './components/profile/dictionary/new-word/new-word.component';
import { LibraryComponent } from './components/profile/library/library.component';
import { NewFileComponent } from './components/profile/library/new-file/new-file.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ClassDetailsDialogComponent } from './components/profile/schedule/class-details-dialog/class-details-dialog.component';
import { ScheduleComponent } from './components/profile/schedule/schedule.component';
import { StudentsComponent } from './components/profile/students/students.component';
import { HomeworkDetailsDialogComponent } from './components/profile/tasks/homework-details-dialog/homework-details-dialog.component';
import { NewTaskComponent } from './components/profile/tasks/new-task/new-task.component';
import { TasksComponent } from './components/profile/tasks/tasks.component';
import { UserSettingsComponent } from './components/profile/user-settings/user-settings.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { PwdChangeComponent } from './components/profile/user-settings/pwd-change/pwd-change.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    LandingComponent,
    GermanTestComponent,
    EnglishTestComponent,
    LoginComponent,
    SignupComponent,
    ScheduleComponent,
    TasksComponent,
    ClassDetailsDialogComponent,
    NewClassComponent,
    StudentsComponent,
    NewTaskComponent,
    HomeworkDetailsDialogComponent,
    DictionaryComponent,
    NewWordComponent,
    IntroComponent,
    CoursesComponent,
    AboutComponent,
    LevelCheckComponent,
    BenefitsComponent,
    FaqComponent,
    ClientFormComponent,
    BlogComponent,
    SocialMediaComponent,
    ProfileComponent,
    UserSettingsComponent,
    ApplicationsComponent,
    ClassOverviewComponent,
    LibraryComponent,
    NewFileComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    QuizComponent,
    PwdChangeComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    FullCalendarModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    NgxSimpleTextEditorModule,
    NgApexchartsModule,
    NgxPaginationModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
