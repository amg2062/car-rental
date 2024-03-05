import { Component } from '@angular/core';
import { CarService } from 'src/app/shared/services/car/car.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bill, Bill2, Reservation2 } from 'src/app/shared/model/car/Car';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit {
reservation1:Reservation2;
bills: Bill2[];

constructor(private carService: CarService, private route:ActivatedRoute){}
ngOnInit(): void {
  const state = this.route.snapshot.paramMap.get('car');
  this.reservation1 =history.state.reservation;
  
  const userId = parseInt(localStorage.getItem('userId'));

  console.log(userId);
  this.carService.getBillsByUserIdWithCarDetails(userId).subscribe(
    (bills: Bill2[]) => {
      this.bills = bills;
      console.log(bills);
    },
    (error) => {
      console.error(error);
    }
  );
}
calculateDuration(reservationStart: Date, reservationEnd: Date): number {
  const diffInMilliseconds = reservationEnd.getTime() - reservationStart.getTime();
  const hours = diffInMilliseconds / (1000 * 60 * 60);
  return Number(hours.toFixed(2));
}

calculateTotalCost(reservationStart: Date, reservationEnd: Date, costPerHour: number): number {
  const durationInHours = this.calculateDuration(reservationStart, reservationEnd);
  return costPerHour * durationInHours;
}


 printBill(bill: Bill2): void {
  

  
   const doc = new jsPDF();
  
   
   const reservationStart = new Date(bill.reservationStart).toLocaleDateString();
   const reservationEnd = new Date(bill.reservationEnd).toLocaleDateString();
  
   
   const totalCarCost = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bill.totalCarCost);
   const costPerHour = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bill.carDetails.costPerHour);
  
   
   doc.setFontSize(12);
  
 
   const pageWidth = doc.internal.pageSize.getWidth();
   const titleCenter = pageWidth / 2;
  
   
   doc.text('Car Rental Bill', titleCenter, 10, { align: 'center' });
  
 
   doc.line(10, 15, pageWidth - 10, 15);
  
 
   doc.text(`Reservation ID: ${bill.reservationID}`, 10, 20);
   doc.text(`Car ID: ${bill.carID}`, 10, 30);
   doc.text(`Reservation Start: ${reservationStart}`, 10, 40);
   doc.text(`Reservation End: ${reservationEnd}`, 10, 50);
  

   doc.line(10, 60, pageWidth - 10, 60);
  
   
   doc.text(`Total Car Cost: ${totalCarCost}`, 10, 70);
   doc.text(`Cost Per Hour: ${costPerHour}`, 10, 80);
  
   
   doc.line(10, 90, pageWidth - 10, 90);
 
   doc.text(`Manufacturer: ${bill.carDetails.manufacturer}`, 10, 100);
   doc.text(`Model: ${bill.carDetails.model}`, 10, 110);
  

   doc.save(`bill-${bill.reservationID}.pdf`);
}
 }

