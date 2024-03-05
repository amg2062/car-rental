import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Reservation, Reservation2 } from 'src/app/shared/model/car/Car';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { CarService } from 'src/app/shared/services/car/car.service';
@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.scss']
})
export class EditReservationComponent implements OnInit {
  reservations: Reservation2[];
 
  constructor(private router: Router,private carService: CarService) {}
 
  ngOnInit(): void {
    const userId = localStorage.getItem('userId'); 
    console.log(userId);
    if (userId) {
       this.carService.getReservationsByUserIdWithCarDetails(parseInt(userId, 10)).subscribe(
         (reservations) => {
         
           this.reservations = reservations;
           console.log(this.reservations);
         },
         (error) => {
           console.error('Error fetching reservations:', error);
         }
       );
    } else {
       console.error('User ID not found');
    }
   }
 
   deleteReservation(reservationId: number): void {
    this.carService.deleteReservation(reservationId).subscribe(
       () => {
       
         this.reservations = this.reservations.filter(reservation => reservation.reservationID !== reservationId);
       },
       (error) => {
         console.error('Error deleting reservation:', error);
       }
    );
   }
   paymentsButton(reservation:Reservation2):void{
    this.carService.sendReservation(reservation);
    this.router.navigate(['/car/payments'], { state: { reservation } });
   }
 }
 