import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://3.223.148.111:8000/api/reports';

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}`);
  }

  generateReport(data: {
    date: string;
    requested_by_email: string;
    format: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate/${data.requested_by_email}`, data);
  }

  getReportsByUser(userId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/user/${userId}`);
  }

  getReportsByDate(date: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/date/${date}`);
  }
}
