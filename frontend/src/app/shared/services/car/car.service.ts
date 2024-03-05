import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { urls } from '../../urls/urls';
import { OnInit } from '@angular/core';
import { Bill, Bill2, Car, Reservation, Reservation2, Review } from '../../model/car/Car';
import { environment } from '../../environment/environment';
import { HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CarService implements OnInit {



  private reservationSource = new BehaviorSubject<Reservation2>(null);
  reservation$ = this.reservationSource.asObservable();
  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) { }
  notificationShown: boolean = false;

getNotificationShown(): boolean {
  return this.notificationShown;
}
  
    private role:"abs";
    token: string
  userId:number
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userId = parseInt(localStorage.getItem('userId'));
  }


  sendReservation(reservation: Reservation2): void {
    this.reservationSource.next(reservation);
  }


//http calls
  fetch(): Observable<Car[]> {
    const token = localStorage.getItem('token');
    // const headers = new HttpHeaders().set(Authorization, `Bearer ${token}`);
    return this.http.get<Car[]>(`${urls.fetchCars}`, { headers: { Authorization:  `Bearer ${token}`} });
  }

  calculateTotalCost(startDate: Date, endDate: Date): Observable<Car[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
    return this.http.get<Car[]>(`${urls.fetchCars}`, { headers, params });
  }
  getCarById(carId: number): Observable<Car> {
    const token = localStorage.getItem('token');
    return this.http.get<Car>(`${environment.baseurl}/api/Cars/${carId}`,{ headers: { Authorization:  `Bearer ${token}`} });

  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    const token = localStorage.getItem('token');
    return this.http.post<Reservation>(`${environment.baseurl}/api/Cars/create-reservation`, reservation,{ headers: { Authorization:  `Bearer ${token}`} });
  }
  login( username: string, password: string,role:string): Observable<any> {
    const token = localStorage.getItem('token');
   
    const payload = {username, password,role};
    return this.http.post(`${environment.baseurl}/api/Login`,payload, { headers: { Authorization:  `Bearer ${token}`} });
  }

  signup(username: string, password: string,role:string): Observable<any> {
    const token = localStorage.getItem('token');
    const payload = { username, password,role};
    return this.http.post(`${environment.baseurl}/api/Signup`, payload,{ headers: { Authorization:  `Bearer ${token}`} });
  }
  getReservationsByUserIdWithCarDetails(userId: number): Observable<Reservation2[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Reservation2[]>(`${environment.baseurl}/api/Cars/reservations/${userId}`,{ headers: { Authorization:  `Bearer ${token}`} });
   }
   deleteReservation(reservationId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${environment.baseurl}/api/Cars/delete-reservation/${reservationId}`,{ headers: { Authorization:  `Bearer ${token}`} });
   }


   createCar(car: Car): Observable<Car> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Car>(`${environment.baseurl}/api/Cars/create-car`, car, { headers: { Authorization:  `Bearer ${token}`} });
  }

  createBill(bill: Bill): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.baseurl}/api/Cars/create-bill`, bill, { headers: { Authorization:  `Bearer ${token}`} });
}
getBillsByUserIdWithCarDetails(userId: number): Observable<Bill2[]> {
  const token = localStorage.getItem('token');
  return this.http.get<Bill2[]>(`${environment.baseurl}/api/Cars/bills/${userId}`,{ headers: { Authorization:  `Bearer ${token}`} });
}

getUpcomingReservations(): Observable<Reservation2[]> {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<Reservation2[]>(`${environment.baseurl}/api/Cars/bills/${userId}`, { headers: { Authorization:  `Bearer ${token}`} });
}

getBillsWithCarDetails(): Observable<Bill2[]> {
  const token = localStorage.getItem('token');
  return this.http.get<Bill2[]>(`${environment.baseurl}/api/Cars/bills`,{ headers: { Authorization:  `Bearer ${token}`} });
}
createReview(review: Review): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.post<any>(`${environment.baseurl}/api/Cars/create-review`, review,{ headers: { Authorization:  `Bearer ${token}`} });  
}
  //>
  isAuthenticated(): boolean {
  

    const token = localStorage.getItem('token');
 
    return token != null;
  }
  hasRole(role: string): boolean {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    return userRole === role;
  }
}