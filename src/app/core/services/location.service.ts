import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ILocation } from '../models/location.model';
import { LocationRequest } from '../requests/location-request.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private baseUrl = `${environment.apiUrl}/Location`;

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<ILocation[]> {
    return this.http.get<ILocation[]>(this.baseUrl);
  }

  getLocation(locationId: string): Observable<ILocation> {
    return this.http.get<ILocation>(`${this.baseUrl}/${locationId}`);
  }

  createLocation(request: LocationRequest): Observable<ILocation> {
    return this.http.post<ILocation>(this.baseUrl, request);
  }

  updateLocation(locationId: string, request: LocationRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${locationId}`, request);
  }

  deleteLocation(locationId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${locationId}`);
  }
}
