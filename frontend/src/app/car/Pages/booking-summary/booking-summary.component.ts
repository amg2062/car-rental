import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from 'src/app/shared/services/car/car.service';
import { Car,Reservation } from 'src/app/shared/model/car/Car';
import { Router } from '@angular/router';
@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.component.html',
  styleUrls: ['./booking-summary.component.scss']
})
export class BookingSummaryComponent implements OnInit {
  selectedCar: Car;
  startDate: Date | null;
  endDate: Date | null;

  //
  

  //
  constructor(private route: ActivatedRoute,private carService:CarService, private router:Router) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
     console.log(userId);
    } else {
     console.error('User ID is not set in localStorage');
    }


    if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
     } else {
      console.error('Web Storage is not supported in this browser.');
     }
    const state = this.route.snapshot.paramMap.get('car');
    this.selectedCar =history.state.car;
    this.startDate = history.state.startDate;
    this.endDate = history.state.endDate;
    if (!this.selectedCar || !this.startDate || !this.endDate) {
     
    }
  }

  confirmBooking(): void {
    const userId = localStorage.getItem('userId');
    const reservation: Reservation = {


      carID: this.selectedCar.carID,
      reservationStart: this.startDate,
      reservationEnd: this.endDate,
      totalCarCost: this.selectedCar.totalCost,
      status: 'booked',
      costPerHour: this.selectedCar.costPerHour,
      userID: parseInt(userId,10)
    };

    this.carService.createReservation(reservation).subscribe(
      (response) => {
        console.log(response);
        alert("Booking Added");
        this.router.navigate(['car/editreservation']);
      },
      (error) => {
        console.log(error);
       
      }
    );
  }
}