import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from 'src/app/shared/model/car/Car';
import { PaymentService } from 'src/app/shared/services/payments/payment.service';
ElementRef
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

selectedReservation: Reservation;

@ViewChild('paymentRef',{static:true}) paymentRef!: ElementRef;

constructor(private route: ActivatedRoute, private payment: PaymentService, private router: Router){}

  ngOnInit(): void {

    const state = this.route.snapshot.paramMap.get('reservation');
    this.selectedReservation =history.state.reservation;

    console.log(this.selectedReservation.totalCarCost);

      console.log(window.paypal);
      window.paypal.Buttons({
        style:{
          layout: 'horizontal',
          color:'blue',
          shape:'rect',
          label:'paypal'
        },
        createOrder:(data:any,actions:any)=>{
          return actions.order.create({
            purchase_units:[
              {
                amount:{
                  value: this.selectedReservation.totalCarCost.toString(),
                  currency_code:'USD'
                }
              }
            ]
          });
        },
        onApprove: (data:any,actions:any)=>{
          return actions.order.capture().then((details:any)=>{
            if(details.status==='COMPLETED'){
             this.payment.transactionID=details.id;
             this.router.navigate(['car/confirmationpage']);
            }
          });
        },
        
        onError:(error:any)=>{
          console.log(error);
        }
      }).render(this.paymentRef.nativeElement);
  }
}
