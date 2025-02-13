import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IEventCategory } from '../models/event-category.model';

@Injectable({ providedIn: 'root' })
export class EventCategoryService {
  private baseUrl = `${environment.apiUrl}/EventCategories`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<IEventCategory[]> {
    return this.http.get<IEventCategory[]>(this.baseUrl);
  }

  getCategory(categoryName: string): Observable<IEventCategory> {
    return this.http.get<IEventCategory>(`${this.baseUrl}/${categoryName}`);
  }

  createCategory(request: IEventCategory): Observable<IEventCategory> {
    return this.http.post<IEventCategory>(this.baseUrl, request);
  }

  updateCategory(categoryName: string, request: IEventCategory): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${categoryName}`, request);
  }

  deleteCategory(categoryName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${categoryName}`);
  }
}
