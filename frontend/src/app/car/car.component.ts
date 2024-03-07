import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CarService } from '../shared/services/car/car.service';
import { Car, Image, Reservation, Review } from '../shared/model/car/Car';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponentComponent } from './Pages/notification-dialog-component/notification-dialog-component.component';
import { Observable, Subscription, tap } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {



  dateRangeForm = new FormGroup({
    startDate: new FormControl(this.getCurrentDate()),
    endDate: new FormControl(this.getNextDayDate())
  });


  averageRatings: {[key: number]: number} = {};
  hasReviews: boolean = true;
  cars: Car[] = [];
  carList: Car[] = [];
  private averageRatingSubscriptions: Subscription[] = [];
  constructor(private domSanitizer:DomSanitizer, private carService: CarService,private router:Router,private jwtHelper: JwtHelperService,private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log(sessionStorage.getItem("token")+"abc");
    this.carService.getUpcomingReservations().subscribe(reservations => {
      if (reservations.length > 0) {
        this.openNotificationDialog(reservations);
      }
    });

    this.carService.fetch().subscribe((data: Car[]) => {
      this.carList = data;
      console.log();
     
      console.log(this.carList);
      this.getAverageRatings();
      this.onSubmit();
    });

  
  }

  onSubmit(): void {
    const startDateValue = this.dateRangeForm.get('startDate')?.value;
  const endDateValue = this.dateRangeForm.get('endDate')?.value;

  if (startDateValue && endDateValue) {
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    this.carService.calculateTotalCost(startDate, endDate).subscribe(cars => {
      this.cars = cars;
      this.fetchImagesForCars();
    });
    
  } else {
    console.log("null error");
  }
}

showBookingSummary(car: Car): void {
  const startDate = this.dateRangeForm.get('startDate')?.value;
  const endDate = this.dateRangeForm.get('endDate')?.value;
  this.router.navigate(['/car/bookingsummary'], { state: { car, startDate, endDate } });
}

giveReview(car:Car):void{
this.router.navigate(['/car/reviews'],{state: {car}});
}

openNotificationDialog(reservations: Reservation[]): void {
  if (!this.carService.notificationShown) {
  const dialogRef = this.dialog.open(NotificationDialogComponentComponent, {
    panelClass: 'custom-dialog',
    width: '400px',
    data: { reservations },
  });

  dialogRef.afterClosed().subscribe(result => {
 
  });
  this.carService.notificationShown=true;
}
}

private getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().slice(0, 16); 
}

private getNextDayDate(): string {
  const now = new Date();
  now.setDate(now.getDate() + 1); 
  return now.toISOString().slice(0, 16); 
}

private getAverageRatings(): void {
  this.carList.forEach((car) => {
    this.averageRatingSubscriptions.push(
      this.carService.getReviewsByCarID(car.carID).subscribe((reviews: Review[]) => {
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((total, review) => total + review.rating, 0);
          this.averageRatings[car.carID] = sum / reviews.length;
        } else {
          this.averageRatings[car.carID] = 0;
        }
      })
    );
  });
}
fetchImagesForCars(): void {
  this.cars.forEach(car => {
     this.carService.getImageByCarID(car.carID).subscribe((image) => {
      console.log(image.imageUrl);
       car.imageUrl = image.imageUrl; // Assuming you've added an imageUrl property to the Car interface
     });
  });
 }
 sanitizeImageUrl(url: string): SafeUrl {
  return this.domSanitizer.bypassSecurityTrustUrl(url);
}
ngOnDestroy(): void {
  this.averageRatingSubscriptions.forEach((subscription) => subscription.unsubscribe());
}
}