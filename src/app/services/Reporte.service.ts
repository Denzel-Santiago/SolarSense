import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Report {
  id: number;
  user_id: number;
  file_name: string;
  storage_path: string;
  created_at: string;
  format: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://3.223.148.111:8000/api/reports';

  constructor(private http: HttpClient) {}

  // POST: Generar un nuevo reporte
  // ReportService

  generateReport(email: string, payload: { date: string; requested_by_email: string; format: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate/${email}`, payload);
  }



  // GET: Obtener reportes por ID de usuario
  getReportsByUserId(userId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/user/${userId}`);
  }

  downloadReport(nombre: string, email: string) {
  const url = `${this.apiUrl}/download/${nombre}/${email}`;
  return this.http.get(url, { responseType: 'blob' }); 
}

}
