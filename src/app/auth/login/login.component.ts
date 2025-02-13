import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  // For user feedback
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Basic validation or rely on 'required' from HTML
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    // Call the AuthService to log in
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        // If successful, store the token & redirect
        this.authService.setToken(res.token);
        // Navigate to events or wherever you want after login
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Login error', err);
        // You can parse err to show a better message
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    });
  }
}
