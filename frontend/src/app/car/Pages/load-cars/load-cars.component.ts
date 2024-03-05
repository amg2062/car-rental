import { Component } from '@angular/core';
import { CarService } from 'src/app/shared/services/car/car.service';
import { Car } from 'src/app/shared/model/car/Car';
@Component({
  selector: 'app-load-cars',
  templateUrl: './load-cars.component.html',
  styleUrls: ['./load-cars.component.scss']
})
export class LoadCarsComponent {
  carList: Car[] = [];
  ngOnInit(): void {
  
  }
  constructor(private carService: CarService){
    
  }
}
