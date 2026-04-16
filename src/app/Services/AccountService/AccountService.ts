// services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Accounts`;

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
  setPassword(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/set-password`, data);
}
signIn(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/signin`, data);
}
}