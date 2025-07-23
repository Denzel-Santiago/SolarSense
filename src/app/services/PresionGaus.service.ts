import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Distribucion {
  x: number[];
  y: number[];
  mean: number;
  std: number;
}

@Injectable({ providedIn: 'root' })
export class PresionGausService {
  private baseUrl = 'https://paneles.zapto.org/api/pressure-distribution'; 

  constructor(private http: HttpClient) {}

  fetchDistribution(days: number): Observable<Distribucion> {
    return this.http.get<Distribucion>(`${this.baseUrl}/${days}`);
  }
}
