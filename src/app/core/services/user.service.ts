import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';
import { UserRequest } from '../requests/user-request.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl);
  }

  getUserById(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${userId}`);
  }

  updateUser(userId: string, userReq: UserRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${userId}`, userReq);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }
}
