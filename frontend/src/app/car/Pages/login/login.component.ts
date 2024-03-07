import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarService } from 'src/app/shared/services/car/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  defaultRole = 'user';
  hideDiv: boolean = true;
  role: string = "Default Role";
  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private router:Router
  ) {}

  

  ngOnInit() {

    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['']
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    } 

    const { username, password,role } = this.loginForm.value;
    this.carService.login(username, password,role).subscribe(
      response => {
  //
  const userId = response.userId;
  const token = response.token;
 const username=response.username;
 console.log(username);
  localStorage.setItem('userId', userId);
  localStorage.setItem('token', token);
  sessionStorage.setItem('username',username)
  //
        sessionStorage.setItem('token', response.token);
        console.log(response);
        this.router.navigate(['car/loadcars']);
      },
      error => {
       
        console.error(error);
        alert("Wrong credentials");
      }
    );
  }
  gotoSignup() {
    this.router.navigate(['car/signup']);
  }
}