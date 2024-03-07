export interface Car {
    availability: boolean;
    carID: number;
    
    carType: string | null;
    costPerHour: number;
    engineCapacity: number;
    fuelType: string | null;
    locationOfCar: string | null;
    manufacturer: string;
    mileage: number;
    model: string;
    noOfSeats: number;
    transmissionType: string;
    yearOfManufacture: number;
    totalCost: number;
    averageRating?: number; 
    imageUrl?: string;
  }


  export interface Reservation {
    carID: number;
    reservationStart: Date; // ISO formatted date string
    reservationEnd: Date; // ISO formatted date string
    totalCarCost: number;
    costPerHour: number;
    status: string; // 'booked' or 'pending'
    userID:number;
  }
  export interface Reservation2 {
    carID: number;
    reservationID:number
    reservationStart: Date; // ISO formatted date string
    reservationEnd: Date; // ISO formatted date string
    totalCarCost: number;
    costPerHour: number;
    status: string; // 'booked' or 'pending'
    userID: number;
    carDetails: Car; // Adding the carDetails property
   }

   export interface Bill {
    reservationID: number;
    userID: number;
    carID: number;
    reservationStart: Date;
    reservationEnd: Date;
    totalCarCost: number;
  }

  export interface Bill2 {
    billID: number;
    reservationID: number;
    userID: number;
    carID: number;
    reservationStart: Date;
    reservationEnd: Date;
    totalCarCost: number;
    carDetails: Car;
  }

  export interface Review {
    RatingID?: number;
    rating: number;
    reviewText: string;
    userID: number;
    carID: number;
  }

  export class Image {
    imageID: number;
    imageUrl: string;
    carID: number;
  }