// services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7090/api/company';

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
  setPassword(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/set-password`, data);
}
login(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, data);
}
}