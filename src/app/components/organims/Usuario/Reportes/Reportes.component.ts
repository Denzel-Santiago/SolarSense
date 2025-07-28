import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [NgFor, DatePipe, FormsModule, SideNavComponent,NgClass],
  templateUrl: './Reportes.component.html',
})
export class ReportesComponent implements OnInit {
  reportes: any[] = [];
  reporteReciente: any = null;

  selectedDate: string = '';
  userEmail: string = ''; // cambia esto si usas auth
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getReportes();
  }

  getReportes() {
    this.http.get<any[]>('http://3.223.148.111:8000/api/reports/').subscribe({
      next: (data) => {
        this.reportes = data.reverse();
        this.reporteReciente = this.reportes.length > 0 ? this.reportes[0] : null;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el historial de reportes', 'error');
      },
    });
  }

  generarReporte() {
    if (!this.selectedDate || !this.userEmail.trim()) {
      Swal.fire('Datos requeridos', 'Selecciona una fecha e ingresa tu correo', 'warning');
      return;
    }

    const payload = {
      date: this.selectedDate,
      requested_by_email: this.userEmail,
      format: 'PDF',
    };

    this.isLoading = true;

    this.http.post('http://3.223.148.111:8000/api/reports/generate/' + this.userEmail, payload).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Reporte generado correctamente', 'success');
        this.getReportes();
        this.selectedDate = '';
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'No se pudo generar el reporte', 'error');
      },
    });
  }

  descargarReporte(path: string) {
    const fullUrl = 'http://3.223.148.111:8000' + path;
    window.open(fullUrl, '_blank');
  }
  get filasVaciasReportes(): any[] {
    const faltantes = 5 - (this.reporteReciente?.length || 0);
    return Array.from({ length: Math.max(faltantes, 0) });
  }
}
