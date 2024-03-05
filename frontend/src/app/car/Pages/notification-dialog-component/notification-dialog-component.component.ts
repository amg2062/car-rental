import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reservation2 } from 'src/app/shared/model/car/Car';
import { MatDialogRef } from '@angular/material/dialog';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-notification-dialog-component',
  templateUrl: './notification-dialog-component.component.html',
  styleUrls: ['./notification-dialog-component.component.scss']
})
export class NotificationDialogComponentComponent implements OnInit {
  ngOnInit(): void {
    const shown = localStorage.getItem('notificationShown');
    this.hasShown = shown ? true : false;
  }
  hasShown: boolean = false;
  constructor( public dialogRef: MatDialogRef<NotificationDialogComponentComponent>,@Inject(MAT_DIALOG_DATA) public data: { reservations: Reservation2[] }) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
