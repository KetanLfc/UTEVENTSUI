// src/app/core/services/user-event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IUserEvent } from '../models/user-event.model';
import { RSVPStatus } from '../enums/rsvp-status.enum';
import { UserEventRequest } from '../requests/user-event-request.model';

@Injectable({ providedIn: 'root' })
export class UserEventService {
  private baseUrl = `${environment.apiUrl}/UserEvents`; 

  constructor(private http: HttpClient) {}

  getUserEventsByStatus(userId: string, status: RSVPStatus): Observable<IUserEvent[]> {
    return this.http.get<IUserEvent[]>(`${this.baseUrl}/${userId}/${status}`);
  }

  getAllUserEventsForUser(userId: string): Observable<IUserEvent[]> {
    return this.http.get<IUserEvent[]>(`${this.baseUrl}/${userId}`); 
  }

  getAllUserEvents(): Observable<IUserEvent[]> {
  return this.http.get<IUserEvent[]>(this.baseUrl);
}

  // Add an RSVP or user-event record
  addUserEvent(userEvent: UserEventRequest | IUserEvent): Observable<void> {
    return this.http.post<void>(this.baseUrl, userEvent);
  }

  // updates RSVP status
  updateUserEventStatus(userId: string, eventId: string, status: RSVPStatus): Observable<void> {
    // Construct { status: 'Going' }
    const body = { status };
  
    // .NET sees {"status":"Going"}
    return this.http.put<void>(
      `${this.baseUrl}/${userId}/${eventId}`,
      body
    );
  }
  


  deleteUserEvent(userId: string, eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/${eventId}`);
  }
}
