import { Component } from '@angular/core';
import { CarService } from 'src/app/shared/services/car/car.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bill, Bill2, Reservation2 } from 'src/app/shared/model/car/Car';
import jsPDF from 'jspdf';

import 'jspdf-autotable';
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

  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleCenter = pageWidth / 2;

  doc.text('Car Rental Bill', titleCenter, margin, { align: 'center' });
  doc.line(margin, margin + 5, pageWidth - margin, margin + 5);

  doc.text(`Reservation ID: ${bill.reservationID}`, margin, margin + 10);
  doc.text(`Car ID: ${bill.carID}`, margin, margin + 20);
  doc.text(`Reservation Start: ${reservationStart}`, margin, margin + 30);
  doc.text(`Reservation End: ${reservationEnd}`, margin, margin + 40);

  doc.line(margin, margin + 50, pageWidth - margin, margin + 50);

  doc.text(`Total Car Cost: ${totalCarCost}`, margin, margin + 60);
  doc.text(`Cost Per Hour: ${costPerHour}`, margin, margin + 70);

  doc.line(margin, margin + 80, pageWidth - margin, margin + 80);

  doc.text(`Manufacturer: ${bill.carDetails.manufacturer}`, margin, margin + 90);
  doc.text(`Model: ${bill.carDetails.model}`, margin, margin + 100);


  const tableStartY = margin + 120;
  const tableCellWidth = (pageWidth - 2 * margin) / 2;

  doc.rect(margin, tableStartY, tableCellWidth, 10, 'S');
  doc.rect(margin + tableCellWidth, tableStartY, tableCellWidth, 10, 'S');

  doc.text('Manufacturer', margin, tableStartY + 7);
  doc.text('Model', margin + tableCellWidth, tableStartY + 7);

  doc.rect(margin, tableStartY + 10, tableCellWidth, 50, 'S');
  doc.rect(margin + tableCellWidth, tableStartY + 10, tableCellWidth, 50, 'S');

  doc.text(bill.carDetails.manufacturer, margin + 5, tableStartY + 17);
  doc.text(bill.carDetails.model, margin + tableCellWidth + 5, tableStartY + 17);

  doc.save(`bill-${bill.reservationID}.pdf`);
}
 }

