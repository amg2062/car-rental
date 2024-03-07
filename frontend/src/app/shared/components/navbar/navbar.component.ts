import { Component,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../../services/car/car.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  username: string;
  constructor(private carService: CarService, private jwtHelper: JwtHelperService,private router:Router,@Inject(JWT_OPTIONS) private jwtOptions: any,private dialog: MatDialog) {
    this.username = sessionStorage.getItem('username') || '';
  }

  addCars(): void {
    
    const token = localStorage.getItem('token');
  const decodedToken = this.jwtHelper.decodeToken(token);
  const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  
  console.log(userRole);
    if (this.carService.hasRole('Admin')|| this.carService.hasRole('Employee')) {
      this.router.navigate(['car/insertcar']);
    } else {
      alert('this fuctionality is oly allowed for Admin');
    }
  
  
   
  }
  editBooking(): void {

    this.router.navigate(['/car/editreservation']);
  }
  showBills(): void {
   
    this.router.navigate(['/car/billpage']);
  }
  
  analytics():void{
    const token = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    
    console.log(userRole);
      if (this.carService.hasRole('Admin') || this.carService.hasRole('Employee')) {
        this.router.navigate(['car/analytics']);
      } else {
        alert('this fuctionality is oly allowed for Admin');
      }
  }
  loadCars():void{
    this.router.navigate(['/car/loadcars']);
  }
  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/car/login']);
  }
}
