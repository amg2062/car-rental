import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  constructor(private router: Router){}
  coverImageUrl = '../../../../assets/carbackground.jpg';
  goToLogin():void{
    this.router.navigate(['car/login']);
  }
  goToSignin():void{
    this.router.navigate(['car/signup']);
  }
}
