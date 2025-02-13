import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IRole } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private baseUrl = `${environment.apiUrl}/Role`;

  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.baseUrl);
  }

  getRoleById(roleId: string): Observable<IRole> {
    return this.http.get<IRole>(`${this.baseUrl}/${roleId}`);
  }

  createRole(request: IRole): Observable<IRole> {
    return this.http.post<IRole>(this.baseUrl, request);
  }

  updateRole(roleId: string, request: IRole): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${roleId}`, request);
  }

  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${roleId}`);
  }
}
