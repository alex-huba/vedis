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

// Components
import { AppComponent } from './app.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { ClassDetailsDialogComponent } from './components/class-details-dialog/class-details-dialog.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { EnglishTestComponent } from './components/landing-tests/english-test/english-test.component';
import { GermanTestComponent } from './components/landing-tests/german-test/german-test.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NewClassComponent } from './components/new-class/new-class.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { SignupComponent } from './components/signup/signup.component';
import { StudentsComponent } from './components/students/students.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { HomeworkDetailsDialogComponent } from './components/homework-details-dialog/homework-details-dialog.component';
import { DictionaryComponent } from './components/dictionary/dictionary.component';
import { NewWordComponent } from './components/new-word/new-word.component';
import { CarouselSectionComponent } from './components/landing/carousel-section/carousel-section.component';
import { AboutSectionComponent } from './components/landing/about-section/about-section.component';
import { TestSectionComponent } from './components/landing/test-section/test-section.component';
import { SchoolProsSectionComponent } from './components/landing/school-pros-section/school-pros-section.component';
import { FaqSectionComponent } from './components/landing/faq-section/faq-section.component';
import { ContactSectionComponent } from './components/landing/contact-section/contact-section.component';
import { BlogSectionComponent } from './components/landing/blog-section/blog-section.component';
import { SocialsSectionComponent } from './components/landing/socials-section/socials-section.component';
import { HeroSectionComponent } from './components/landing/hero-section/hero-section.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    LandingComponent,
    GermanTestComponent,
    EnglishTestComponent,
    LoginComponent,
    HomeComponent,
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
    HeroSectionComponent,
    CarouselSectionComponent,
    AboutSectionComponent,
    TestSectionComponent,
    SchoolProsSectionComponent,
    FaqSectionComponent,
    ContactSectionComponent,
    BlogSectionComponent,
    SocialsSectionComponent,
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
