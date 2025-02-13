import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IGroup } from '../models/group.model';
import { GroupRequest } from '../requests/group-request.model';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private baseUrl = `${environment.apiUrl}/Group`;

  constructor(private http: HttpClient) {}

  getAllGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(this.baseUrl);
  }

  getGroupById(groupId: string): Observable<IGroup> {
    return this.http.get<IGroup>(`${this.baseUrl}/${groupId}`);
  }

  createGroup(request: GroupRequest): Observable<IGroup> {
    return this.http.post<IGroup>(this.baseUrl, request);
  }

  updateGroup(groupId: string, request: GroupRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${groupId}`, request);
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}`);
  }
}
