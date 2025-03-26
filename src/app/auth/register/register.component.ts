import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { GroupService } from '../../core/services/group.service'; 
import { IGroup } from '../../core/models/group.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  showPassword = false;        // controls password field
  showConfirmPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Form fields
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  selectedGroupId: string | null = null;

  // Groups fetched from the backend
  groups: IGroup[] = [];

  // UI feedback
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all groups on component init
    this.groupService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
      },
      error: (err) => {
        console.error('Failed to load groups', err);
      }
    });
  }

  onSubmit(): void {
    // 1) Basic required checks
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.selectedGroupId
    ) {
      this.errorMessage = 'All fields, including Group, are required.';
      this.successMessage = null;
      return;
    }

    // 2) Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.successMessage = null;
      return;
    }

    // 3) Enforce the university email domain (client-side check)
    if (
      !this.email.endsWith('@umail.utm.ac.mu') &&
      !this.email.endsWith('@utm.ac.mu')
    ) {
      this.errorMessage =
        'Only university emails (@umail.utm.ac.mu or @utm.ac.mu) are allowed.';
      this.successMessage = null;
      return;
    }

    // 4) Build the payload for registration
    const payload = {
      name: this.name,
      email: this.email,
      password: this.password, // only the confirmed password
      isActive: true,
      groupId: this.selectedGroupId
      // RoleId is handled server-side (default to Student)
    };

    // 5) Call the AuthService to register
    this.authService.register(payload).subscribe({
      next: () => {
        // On success, show a confirmation
        this.errorMessage = null;
        this.successMessage = 'Registration successful! Redirecting to login...';

        // Auto-redirect after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.successMessage = null;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }
}
