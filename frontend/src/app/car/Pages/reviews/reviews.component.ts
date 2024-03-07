import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Car, Review } from 'src/app/shared/model/car/Car';
import { CarService } from 'src/app/shared/services/car/car.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  reviewForm: FormGroup;
  selectedReview: Car;
  userID: number;
  ratingControl = new FormControl();
  fetchedReviews: Review[];

  constructor(private fb: FormBuilder, private carService: CarService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const state = this.route.snapshot.paramMap.get('car');
    this.selectedReview = history.state.car;

    
    console.log(this.selectedReview);
    this.userID=parseInt(localStorage.getItem('userId'));
    console.log(this.userID);
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      reviewText: ['', Validators.required]
    });

    this.carService.getReviewsByCarID(this.selectedReview.carID).subscribe(
      (response) => {
        
        this.fetchedReviews = response;
        
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
    
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      return;
    }

    const rating = this.reviewForm.controls['rating'].value;
    const reviewText = this.reviewForm.controls['reviewText'].value;

    const review = {
      rating: rating,
      reviewText: reviewText,
      userID: this.userID,
      carID: this.selectedReview.carID 
    };

    
    this.carService.createReview(review).subscribe(
      (response) => {
        this.fetchedReviews.push(response);
        console.log(response);
        
        this.reviewForm.reset();
        
      },
      (error) => {
        console.log(error);
      }
    );
    
  }
}