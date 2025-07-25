//sensor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private baseUrl = 'http://127.0.0.1:8000/api';  // URL base de tu API

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Ocurrió un error al procesar la solicitud'));
  }

  getSensorsData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sensors-data`).pipe(catchError(this.handleError));
  }

  getPressureStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pressure-stats`).pipe(catchError(this.handleError));
  }

  getHumidityStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/humidity-stats`).pipe(catchError(this.handleError));
  }

  getTemperatureStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/temperature-stats`).pipe(catchError(this.handleError));
  }

  getVoltageStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/voltage-stats`).pipe(catchError(this.handleError));
  }

  getJointProbability(): Observable<any> {
    return this.http.get(`${this.baseUrl}/joint-probability`).pipe(catchError(this.handleError));
  }

  getPressureDistribution(days: number = 7): Observable<any> {
    return this.http.get(`${this.baseUrl}/pressure-distribution/${days}`).pipe(catchError(this.handleError));
  }

  getTemperatureDistribution(days: number = 7): Observable<any> {
    return this.http.get(`${this.baseUrl}/temperature-distribution?days=${days}`).pipe(catchError(this.handleError));
  }

  getHumidityDistribution(days: number = 7): Observable<any> {
    return this.http.get(`${this.baseUrl}/humidity-distribution?days=${days}`).pipe(catchError(this.handleError));
  }
}
