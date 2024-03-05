import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, Reservation2 } from 'src/app/shared/model/car/Car';
import { CarService } from 'src/app/shared/services/car/car.service';
import { PaymentService } from 'src/app/shared/services/payments/payment.service';
import { Bill } from 'src/app/shared/model/car/Car';
@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss']
})
export class ConfirmationPageComponent implements OnInit {
  transactionId="";
 reservation:Reservation2;
  constructor(private payment: PaymentService,private carService:CarService, private router:Router){}
ngOnInit(): void {
    this.transactionId=this.payment.transactionID;
    this.carService.reservation$.subscribe(reservation => {
      
      if (reservation) {
        console.log(reservation);
        this.reservation=reservation
      } else {
        console.error('Reservation data not found');
      }
    });
}

generateBill(reservation: Reservation2): void {

  const bill: Bill = {
      reservationID: reservation.reservationID,
      userID: reservation.userID,
      carID: reservation.carID,
      reservationStart: reservation.reservationStart,
      reservationEnd: reservation.reservationEnd,
      totalCarCost: reservation.totalCarCost
  };


  this.carService.createBill(bill).subscribe(
      (result) => {
         
          this.router.navigate(['car/billpage'],{ state: {reservation } });
          console.log('Bill created successfully', result);
      },
      (error) => {
        
          console.error('Bill creation failed', error);
      }
  );
}


}
