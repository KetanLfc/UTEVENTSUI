import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  nameid: string;   // the claim storing the user ID
  role: string; // the claim storing the user's role (Admin/Student)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Logs in a user by sending {email, password} to /api/users/login
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      { email, password }
    );
  }

  /**
   * Registers a new user
   */
  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, payload);
  }

  /**
   * Saves the returned JWT token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Retrieves the current JWT from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Checks if user is logged in by seeing if a token is stored
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Logs out user by removing the token
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  /**
   * Decodes the JWT to extract the user ID from the 'id' claim
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwt_decode<JwtPayload>(token); // Decode the token properly
      return decoded.nameid;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Checks if the 'role' claim in the token is 'Admin'
   */
  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwt_decode<JwtPayload>(token); // Decode the token for role checking
      return decoded.role === 'Admin';
    } catch (err) {
      console.error('Error decoding token:', err);
      return false;
    }
  }
}