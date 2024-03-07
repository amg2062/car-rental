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
  imageUrl: FormGroup;

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
      LocationOfCar: [''],
    
    });

    this.imageUrl=this.formBuilder.group({
      imageUrl1: ['']
    });
  }

  onSubmit() {
    if (this.carForm.invalid) {
      return;
    }

    const carID:number = this.carForm.get('CarID').value;

    const image = {
      imageID:0,
      imageUrl: this.imageUrl.value.imageUrl1,
      carID: carID
    };
    console.log(image);
    this.carService.insertImage(image).subscribe(
      (response) => {
        console.log('Image inserted successfully:', response);
      
      },
      (error) => {
        console.error('Error inserting image:', error);
       
      }
    );
  
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
