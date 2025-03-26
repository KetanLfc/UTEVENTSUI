import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slides = [
    {
      image: 'assets/Homepage/Events-and-programs-collage.png',
      title: 'Push Your Boundaries',
      info: 'Explore fresh ideas, deepen friendships, test your limits.'
    },
    {
      image: 'assets/Homepage/5883639-Michael-O-Leary-Quote-University-is-the-best-couple-of-years-of.jpg',
      title: 'Unforgettable Years',
      info: 'Savor the once-in-a-lifetime blend of discovery and excitement.'
    },
    {
      image: 'assets/Homepage/7009172-David-Brooks-Quote-College-is-about-exposing-students-to-many.jpg',
      title: 'Endless Opportunities',
      info: 'Dive into diverse experiences—any could spark a lifelong passion.'
    },
    {
      image: 'assets/Homepage/amartyasen1.jpg',
      title: 'A Life of Learning',
      info: 'Immerse yourself in growth from day one; never stop exploring.'
    },
    {
      image: 'assets/Homepage/students.jpg',
      title: 'Fun + Learning',
      info: 'Fuse creativity with knowledge for a memorable, meaningful journey.'
    }
  ];

  currentSlideIndex = 0; 
  autoPlayInterval: any;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  // Manually go to a specific slide
  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.restartAutoPlay();
  }

  // Start auto-play
  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 seconds per slide
  }

  // Clear & restart auto-play
  restartAutoPlay(): void {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }

  // Move to next slide
  nextSlide(): void {
    this.currentSlideIndex++;
    if (this.currentSlideIndex >= this.slides.length) {
      this.currentSlideIndex = 0;
    }
  }

  // Move to prev slide 
  prevSlide(): void {
    this.currentSlideIndex--;
    if (this.currentSlideIndex < 0) {
      this.currentSlideIndex = this.slides.length - 1;
    }
  }
}
