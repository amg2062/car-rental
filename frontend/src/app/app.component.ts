import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  
  title = 'project';

  showNavbar = true;

 constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = event.url !== '/car/login' && event.url !== '/car/signup';
      }
    });
 }
 ngOnInit(){
  const token = sessionStorage.getItem('token');
  if (token) {
      return true;
  } else {
    sessionStorage.clear();
    this.router.navigate(['/car']);
    return false;
    
 }
}}
