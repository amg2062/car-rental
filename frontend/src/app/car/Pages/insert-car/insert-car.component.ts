import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from 'src/app/shared/services/car/car.service';
@Component({
  selector: 'app-insert-car',
  templateUrl: './insert-car.component.html',
  styleUrls: ['./insert-car.component.scss']
})
export class InsertCarComponent {
  carForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private carService: CarService) {
    this.carForm = this.formBuilder.group({
      CarID: [''],
      Manufacturer: ['', Validators.required],
      Model: ['', Validators.required],
      TransmissionType: ['', Validators.required],
      NoOfSeats: ['', Validators.required],
      EngineCapacity: ['', Validators.required],
      CarType: [''],
      YearOfManufacture: ['', Validators.required],
      FuelType: [''],
      Mileage: ['', Validators.required],
      Availability: ['', Validators.required],
      CostPerHour: ['', Validators.required],
      LocationOfCar: ['']
    });
  }

  onSubmit() {
    if (this.carForm.invalid) {
      return;
    }
  
    this.carService.createCar(this.carForm.value).subscribe(
      (response) => {
        console.log(response);
        
      },
      (error) => {
        console.error(error);
     
      }
    );
  }
}
