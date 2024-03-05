import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from 'src/app/shared/services/car/car.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role:['', Validators.required],
    });
  }

  get form() {
    return this.signupForm.controls;
  }

  signup() {
    if (this.signupForm.invalid) {
      return;
    }

    const { username, password ,role} = this.signupForm.value;
    this.carService.signup(username, password,role).subscribe(
      response => {
       
        console.log(response);
        this.router.navigate(['/car/login'])
      },
      error => {
       
        console.error(error);
        alert("User already exists");
      }
    );
  }
}