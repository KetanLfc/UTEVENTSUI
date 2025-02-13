import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IAllowedEventRole } from '../models/allowed-event-role';
import { AllowedEventRoleRequest } from '../requests/allowed-event-role-request.model';

@Injectable({ providedIn: 'root' })
export class AllowedEventRoleService {
  private baseUrl = `${environment.apiUrl}/AllowedEventRoles`;

  constructor(private http: HttpClient) {}

  getAllowedRoles(eventId: string): Observable<IAllowedEventRole[]> {
    return this.http.get<IAllowedEventRole[]>(`${this.baseUrl}/${eventId}`);
  }

  addAllowedEventRole(request: IAllowedEventRole | AllowedEventRoleRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl, request);
  }

  deleteAllowedEventRole(eventId: string, role: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${eventId}/${role}`);
  }
}
