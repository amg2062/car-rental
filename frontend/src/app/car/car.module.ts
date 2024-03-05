import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarRoutingModule } from './car-routing.module';
import { CarComponent } from './car.component';
import { LoadCarsComponent } from './Pages/load-cars/load-cars.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BookingSummaryComponent } from './Pages/booking-summary/booking-summary.component';
import { LoginComponent } from './Pages/login/login.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { EditReservationComponent } from './Pages/edit-reservation/edit-reservation.component';
import { PaymentsComponent } from './Pages/payments/payments.component';
import { ConfirmationPageComponent } from './Pages/confirmation-page/confirmation-page.component';
import { InsertCarComponent } from './Pages/insert-car/insert-car.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { BillPageComponent } from './Pages/bill-page/bill-page.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationDialogComponentComponent } from './Pages/notification-dialog-component/notification-dialog-component.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { AnalyticsDashboardComponent } from './Pages/analytics-dashboard/analytics-dashboard.component';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { ReviewsComponent } from './Pages/reviews/reviews.component';


@NgModule({
  declarations: [
    CarComponent,
    LoadCarsComponent,
    BookingSummaryComponent,
    LoginComponent,
    SignupComponent,
    EditReservationComponent,
    PaymentsComponent,
    ConfirmationPageComponent,
    InsertCarComponent,
    BillPageComponent,
    NotificationDialogComponentComponent,
    AnalyticsDashboardComponent,
    LandingPageComponent,
    ReviewsComponent,

    
  ],
  imports: [
    CommonModule,
    CarRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCardModule,
    MatListModule,
  ],
  providers:[
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
  ],

})
export class CarModule { }
