import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IEvent } from '../models/event.model';
import { EventRequest } from '../requests/event-request.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private baseUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(this.baseUrl);
  }

  getEventById(id: string): Observable<IEvent> {
    return this.http.get<IEvent>(`${this.baseUrl}/${id}`);
  }

  createEvent(req: EventRequest): Observable<IEvent> {
    return this.http.post<IEvent>(this.baseUrl, req);
  }

  updateEvent(id: string, req: EventRequest): Observable<IEvent> {
    return this.http.put<IEvent>(`${this.baseUrl}/${id}`, req);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}