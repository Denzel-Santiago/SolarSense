// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = 'http://3.223.148.111:8000/api/auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    // Limpiar TODOS los datos de storage al iniciar
    this.cleanAllStorage();
    
    this.currentUserSubject = new BehaviorSubject<any>(
      this.getValidUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private cleanAllStorage(): void {
    // Limpiar TODOS los posibles tokens del localStorage
    const keysToRemove = ['currentUser', 'auth_token', 'auth_user', 'token'];
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });

    // También verificar si hay datos de usuario válidos
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (!user?.token || this.isTokenExpired(user.token)) {
          localStorage.removeItem('currentUser');
        }
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  private getValidUserFromStorage(): any {
    const userData = localStorage.getItem('currentUser');
    if (!userData) return null;
    
    try {
      const user = JSON.parse(userData);
      if (!user?.token || this.isTokenExpired(user.token)) {
        localStorage.removeItem('currentUser');
        return null;
      }
      return user;
    } catch (e) {
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      return true;
    }
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/email/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Para debugging
          
          // La respuesta incluye success, token y user
          if (response?.success && response?.token && !this.isTokenExpired(response.token)) {
            // Crear el objeto de usuario con la estructura correcta
            const userData = {
              token: response.token,
              user: response.user,
              // Copiar propiedades importantes al nivel raíz para compatibilidad
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              is_admin: response.user.is_admin,
              membership: response.user.membership || 'free'
            };
            this.storeUserData(userData);
          } else {
            throw new Error('Invalid login response');
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google`, { idToken })
      .pipe(
        tap(response => {
          console.log('Google login response:', response); // Para debugging
          
          // Manejar la respuesta de Google login
          if (response?.success && response?.token && !this.isTokenExpired(response.token)) {
            const userData = {
              token: response.token,
              user: response.user,
              // Copiar propiedades importantes al nivel raíz
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              is_admin: response.user.is_admin || false,
              membership: response.user.membership || 'free'
            };
            this.storeUserData(userData);
          } else if (response?.token && !this.isTokenExpired(response.token)) {
            // Formato alternativo de respuesta
            const userData = {
              token: response.token,
              user: response.user || response,
              id: response.user?.id || response.id,
              username: response.user?.username || response.username,
              email: response.user?.email || response.email,
              is_admin: response.user?.is_admin || response.is_admin || false,
              membership: response.user?.membership || response.membership || 'free'
            };
            this.storeUserData(userData);
          } else {
            throw new Error('Invalid Google login response');
          }
        }),
        catchError(error => {
          console.error('Google login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/email/register`, { 
      username, 
      email, 
      password 
    }).pipe(
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  private storeUserData(user: any): void {
    if (!user?.token || this.isTokenExpired(user.token)) {
      throw new Error('Attempt to store invalid user data');
    }
    
    console.log('Storing user data:', user); // Para debugging
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    // Limpiar TODOS los posibles tokens
    const keysToRemove = ['currentUser', 'auth_token', 'auth_user', 'token'];
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/Login']);
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    const isValid = !!user?.token && !this.isTokenExpired(user.token);
    console.log('isLoggedIn check:', { user, isValid }); // Para debugging
    return isValid;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    const adminStatus = user?.is_admin === true || user?.user?.is_admin === true;
    console.log('isAdmin check:', { user, adminStatus }); // Para debugging
    return adminStatus;
  }

  isPremium(): boolean {
    const user = this.currentUserValue;
    return user?.membership === 'premium' || user?.user?.membership === 'premium';
  }

  isFree(): boolean {
    const user = this.currentUserValue;
    const membership = user?.membership || user?.user?.membership;
    return membership === 'free' || (!membership && !this.isAdmin());
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    if (!user?.token || this.isTokenExpired(user.token)) {
      // Si el token expiró, limpiar el storage
      this.logout();
      return null;
    }
    return user.token;
  }

  getUserRole(): string {
    if (!this.isLoggedIn()) return 'guest';
    if (this.isAdmin()) return 'admin';
    if (this.isPremium()) return 'premium';
    return 'free';
  }
}