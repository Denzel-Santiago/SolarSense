// src/app/auth/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Obtener la URL actual
  const reqUrl = req.url;
  
  console.log('Interceptor - Request URL:', reqUrl); // Para debugging
  
  // Lista completa de endpoints que NO deben tener token
  const isAuthRequest = reqUrl.includes('/auth/email/login') || 
                       reqUrl.includes('/auth/email/register') ||
                       reqUrl.includes('/auth/google') || 
                       reqUrl.includes('accounts.google.com') ||
                       reqUrl.includes('/register') ||
                       reqUrl.includes('/login') ||
                       reqUrl.includes('gsi/client');
  
  console.log('Interceptor - Is auth request:', isAuthRequest); // Para debugging
  console.log('Interceptor - User logged in:', authService.isLoggedIn()); // Para debugging
  
  // SOLO agregar token si:
  // 1. NO es una petición de autenticación
  // 2. El usuario está realmente logueado
  // 3. El token existe y es válido
  if (!isAuthRequest && authService.isLoggedIn()) {
    const authToken = authService.getToken();
    
    if (authToken) {
      console.log('Interceptor - Adding token to request'); // Para debugging
      // Clonar la solicitud y agregar el token
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next(authReq);
    }
  }
  
  console.log('Interceptor - Request without token'); // Para debugging
  return next(req);
};