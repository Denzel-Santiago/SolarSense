// src/app/services/novedades.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Novedad } from '../Interface/Novedad';

@Injectable({
  providedIn: 'root'
})
export class NovedadesService {
  private apiUrl = 'http://3.223.148.111:8000/system-news/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Novedad[]> {
    return this.http.get<Novedad[]>(this.apiUrl);
  }

  getById(id: number): Observable<Novedad> {
    return this.http.get<Novedad>(`${this.apiUrl}${id}`);
  }

  create(novedad: Omit<Novedad, 'id' | 'created_at'>): Observable<Novedad> {
    return this.http.post<Novedad>(this.apiUrl, novedad);
  }

  update(id: number, novedad: Partial<Novedad>): Observable<Novedad> {
    return this.http.put<Novedad>(`${this.apiUrl}${id}`, novedad);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}`);
  }
}
