import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import Swal from 'sweetalert2';
import { ReportService } from '../../../../services/Reporte.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [NgFor, DatePipe, FormsModule, SideNavComponent, NgClass],
  templateUrl: './Reportes.component.html',
})
export class ReportesComponent implements OnInit {
  reportes: any[] = [];
  reporteReciente: any = null;

  selectedDate: string = '';
  userEmail: string = '';
  userId: number = 0;
  isLoading = false;
  errorMessage = '';

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
  this.setTodayDate(); // Establece la fecha al cargar
  this.obtenerUsuarioAutenticado();
}

setTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  this.selectedDate = `${year}-${month}-${day}`;
}


  obtenerUsuarioAutenticado() {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      this.errorMessage = 'No se pudo obtener el usuario autenticado';
      return;
    }

    const isGoogleUser = currentUser.user?.auth_type === 'google' ||
                         currentUser.auth_type === 'google' ||
                         currentUser.user?.provider === 'google' ||
                         currentUser.provider === 'google';

    if (isGoogleUser) {
      let googleUid: string = currentUser.user?.uid || currentUser.uid || currentUser.user?.id || currentUser.id;

      if (!googleUid) {
        this.errorMessage = 'UID de usuario de Google no encontrado';
        return;
      }

      this.http.get<any>(`http://3.223.148.111:8000/api/auth/google/users/${googleUid}`).subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.userId = response.user.id;
            this.userEmail = response.user.email;
            this.getReportes();
          } else {
            this.errorMessage = 'No se encontraron datos del usuario Google';
          }
        },
        error: (error) => {
          console.error('Error al obtener usuario Google:', error);
          this.errorMessage = 'Error al obtener datos del usuario Google';
        }
      });

    } else {
      let userId: number = currentUser.user?.id || currentUser.id;

      if (!userId) {
        this.errorMessage = 'ID del usuario regular no encontrado';
        return;
      }

      this.http.get<any>(`http://3.223.148.111:8000/api/auth/public/users/${userId}`).subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.userId = response.user.id;
            this.userEmail = response.user.email;
            this.getReportes();
          } else {
            this.errorMessage = 'No se encontraron datos del usuario';
          }
        },
        error: (error) => {
          console.error('Error al obtener usuario regular:', error);
          this.errorMessage = 'Error al obtener datos del usuario';
        }
      });
    }
  }

  getReportes() {
    if (!this.userId) return;

    this.reportService.getReportsByUserId(this.userId).subscribe({
      next: (data) => {
        this.reportes = data.reverse();
        this.reporteReciente = this.reportes.length > 0 ? this.reportes[0] : null;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el historial de reportes', 'error');
      }
    });
  }

  generarReporte() {
  if (!this.userEmail.trim()) {
    Swal.fire('Datos requeridos', 'No se encontró el correo del usuario', 'warning');
    return;
  }

  this.isLoading = true;

  const payload = {
    date: this.selectedDate, 
    requested_by_email: this.userEmail,
    format: 'PDF'
  };

  this.reportService.generateReport(this.userEmail, payload).subscribe({
    next: () => {
      Swal.fire('Éxito', 'Reporte generado correctamente', 'success');
      this.getReportes();
      this.setTodayDate();  // Reinicia con la fecha de hoy por si acaso
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
      Swal.fire('Error', 'No se pudo generar el reporte', 'error');
    }
  });
}


  descargarReporte(nombre: string) {
  if (!this.userEmail) {
    Swal.fire('Error', 'No se encontró el correo del usuario', 'error');
    return;
  }

  this.reportService.downloadReport(nombre, this.userEmail).subscribe({
    next: (blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = nombre;
      a.click();
      URL.revokeObjectURL(objectUrl);
    },
    error: () => {
      Swal.fire('Error', 'No se pudo descargar el reporte', 'error');
    }
  });
}


  get filasVaciasReportes(): any[] {
    const faltantes = 5 - (this.reportes.length || 0);
    return Array.from({ length: Math.max(faltantes, 0) });
  }
}
