import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Car, Review } from 'src/app/shared/model/car/Car';
import { CarService } from 'src/app/shared/services/car/car.service';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  reviewForm: FormGroup;
  selectedReview: Car;
  userID: number;

 
  constructor(private fb: FormBuilder, private carService: CarService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const state = this.route.snapshot.paramMap.get('car');
    this.selectedReview = history.state.car;

    
    console.log(this.selectedReview);
    this.userID=parseInt(localStorage.getItem('userId'));
    console.log(this.userID);
    this.reviewForm = this.fb.group({
      reviewID:[''],
      rating: ['', Validators.required],
      review: ['', Validators.required],
      userID: this.userID,
      carID: this.selectedReview.carID,
      
    });


  }

  createReview(): void {
    if (this.reviewForm.invalid) {
      return;
    }

    const review: Review = {
      reviewID: 0, 
      rating: this.reviewForm.get('rating').value,
      review: this.reviewForm.get('review').value, 
      userID: this.userID,
      carID: this.selectedReview.carID,
    };

    this.carService.createReview(this.reviewForm.value).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}