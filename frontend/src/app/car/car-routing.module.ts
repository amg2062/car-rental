import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './car.component';
import { LoadCarsComponent } from './Pages/load-cars/load-cars.component';
import { BookingSummaryComponent } from './Pages/booking-summary/booking-summary.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { LoginComponent } from './Pages/login/login.component';
import { AuthGuard } from '../auth.guard';
import { EditReservationComponent } from './Pages/edit-reservation/edit-reservation.component';
import { PaymentsComponent } from './Pages/payments/payments.component';
import { ConfirmationPageComponent } from './Pages/confirmation-page/confirmation-page.component';
import { InsertCarComponent } from './Pages/insert-car/insert-car.component';
import { BillPageComponent } from './Pages/bill-page/bill-page.component';
import { AnalyticsDashboardComponent } from './Pages/analytics-dashboard/analytics-dashboard.component';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { ReviewsComponent } from './Pages/reviews/reviews.component';
const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'loadcars', component: CarComponent,canActivate: [AuthGuard]},

  { path: 'bookingsummary', component: BookingSummaryComponent ,canActivate: [AuthGuard]},
  { path: 'editreservation', component: EditReservationComponent },
  {path:'payments',component:PaymentsComponent,canActivate: [AuthGuard]},
  {path:'signup',component:SignupComponent,canActivate: [AuthGuard]},
  {path:'confirmationpage',component:ConfirmationPageComponent,canActivate: [AuthGuard]},
  {path:'insertcar',component:InsertCarComponent,canActivate: [AuthGuard]},
  {path:'billpage',component:BillPageComponent,canActivate: [AuthGuard]},
  {path:'analytics',component:AnalyticsDashboardComponent,canActivate: [AuthGuard]},
  {path:'reviews',component:ReviewsComponent,canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
