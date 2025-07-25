// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../Interface/Membresia'; 
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://3.223.148.111:8000/api/memberships';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('UserService Error:', error);
    
    // Si es un error 401, significa que el token expiró
    if (error.status === 401) {
      this.authService.logout();
      return throwError(() => ({ error: { error: 'Sesión expirada. Por favor inicia sesión nuevamente.' } }));
    }
    
    return throwError(() => error);
  }

  getUsers(): Observable<User[]> {
    try {
      return this.http.get<User[]>(this.baseUrl, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  upgradeToPremium(userId: number): Observable<any> {
    try {
      const url = `${this.baseUrl}/user/${userId}`;
      return this.http.put(url, {}, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  downgradeToFree(userId: number): Observable<any> {
    try {
      const url = `${this.baseUrl}/user/${userId}/downgrade`;
      return this.http.post(url, {}, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  createUser(usuario: any): Observable<any> {
    try {
      const url = `${this.baseUrl}/register`;
      return this.http.post(url, usuario, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateUser(userId: number, usuario: any): Observable<any> {
    try {
      const url = `${this.baseUrl}/user/${userId}/update`;
      return this.http.put(url, usuario, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  deleteUser(userId: number): Observable<any> {
    try {
      const url = `${this.baseUrl}/user/${userId}/delete`;
      return this.http.delete(url, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(this.handleError.bind(this))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}