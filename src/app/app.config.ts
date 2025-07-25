// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración mejorada del Router
    provideRouter(
      routes,
      withComponentInputBinding(), // Permite binding directo de parámetros de ruta a inputs de componentes
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Restaura la posición de scroll al cambiar de ruta
        anchorScrolling: 'enabled' // Permite scroll a anclas
      }),
      withRouterConfig({
        paramsInheritanceStrategy: 'always', // Hereda parámetros de rutas padre
        onSameUrlNavigation: 'reload' // Comportamiento al navegar a la misma URL
      }),
      withHashLocation() // Usa HashLocationStrategy para evitar problemas con el servidor
    ),
    
    // Configuración de hidratación para SSR
    provideClientHydration(
      withEventReplay() // Mejora la experiencia de usuario durante la hidratación
    ),
    
    // Configuración de HttpClient con interceptor de autenticación
    provideHttpClient(
      withInterceptors([authInterceptor]) // Aplica el interceptor de autenticación
    ),
    
    // Configuración de Zone.js
    provideZoneChangeDetection({
      eventCoalescing: true, // Optimiza el manejo de eventos
      runCoalescing: true   // Optimiza la detección de cambios
    }),
    
    // Configuración para JWT Helper
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ]
};