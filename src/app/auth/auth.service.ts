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
    this.cleanAllStorage();
    this.currentUserSubject = new BehaviorSubject<any>(this.getValidUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private cleanAllStorage(): void {
    const keysToRemove = ['currentUser', 'auth_token', 'auth_user', 'token'];
    keysToRemove.forEach(key => localStorage.removeItem(key));

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

  // Generar token JWT simple en el frontend
  private generateLocalToken(user: any): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin || false,
      membership: user.membership || 'free',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // Codificar en base64
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
    
    // Crear signature simple (en producción debería usar una clave secreta real)
    const signature = btoa(`${encodedHeader}.${encodedPayload}.secret`).replace(/=/g, '');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/email/login`, { email, password })
      .pipe(
        tap(response => {
          if (response?.token && !this.isTokenExpired(response.token)) {
            const userData = {
              token: response.token,
              user: response.user,
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
    return this.http.post<any>(`${this.apiUrl}/google`, { idToken }).pipe(
      tap(response => {
        console.log('Google login response:', response);

        // Si el backend solo confirma la autenticación, decodificar el token de Google
        if (response?.success) {
          try {
            // Decodificar el token de Google para obtener información del usuario
            const googlePayload = this.decodeGoogleToken(idToken);
            
            if (googlePayload) {
              // Generar token local
              const localToken = this.generateLocalToken({
                id: googlePayload.sub,
                email: googlePayload.email,
                username: googlePayload.name || googlePayload.email.split('@')[0],
                is_admin: false,
                membership: 'free'
              });

              const userData = {
                token: localToken,
                user: {
                  id: googlePayload.sub,
                  email: googlePayload.email,
                  username: googlePayload.name || googlePayload.email.split('@')[0],
                  is_admin: false,
                  membership: 'free'
                },
                id: googlePayload.sub,
                username: googlePayload.name || googlePayload.email.split('@')[0],
                email: googlePayload.email,
                is_admin: false,
                membership: 'free'
              };

              console.log('Generated user data:', userData);
              this.storeUserData(userData);
              return;
            }
          } catch (error) {
            console.error('Error decoding Google token:', error);
          }
        }

        // Fallback: si hay token en la respuesta del backend
        const token = response?.token;
        const user = response?.user ?? {};

        if (token && !this.isTokenExpired(token)) {
          const userData = {
            token: token,
            user: user,
            id: user?.id || '',
            username: user?.username || '',
            email: user?.email || '',
            is_admin: user?.is_admin || false,
            membership: user?.membership || 'free'
          };
          this.storeUserData(userData);
        } else {
          throw new Error('No valid authentication data received');
        }
      }),
      catchError(error => {
        console.error('Google login error:', error);
        Swal.fire('Error', 'Google login error: ' + (error?.message || 'Unknown error'), 'error');
        return throwError(() => error);
      })
    );
  }

  private decodeGoogleToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding Google token:', error);
      return null;
    }
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
    if (!user?.token) {
      throw new Error('Attempt to store invalid user data');
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    const keysToRemove = ['currentUser', 'auth_token', 'auth_user', 'token'];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    this.currentUserSubject.next(null);
    this.router.navigate(['/Login']);
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    const isValid = !!user?.token && !this.isTokenExpired(user.token);
    return isValid;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.is_admin === true || user?.user?.is_admin === true;
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