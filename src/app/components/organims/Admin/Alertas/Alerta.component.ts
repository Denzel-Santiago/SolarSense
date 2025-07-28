import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // AÑADIDO HttpClient
import { FormsModule } from '@angular/forms';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';
import { UserService } from '../../../../services/User.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alerta',
  templateUrl: './Alerta.component.html',
  standalone: true,
  imports: [HttpClientModule, NgClass, NgFor, SideNavAdminComponent, FormsModule]
})
export class AlertaComponent implements OnInit {
  usuariosNormales: any[] = [];
  usuariosGoogle: any[] = [];

  constructor(
    private userService: UserService,
    private http: HttpClient // INYECTADO HttpClient
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        const usuarios = data.filter((u: any) => u.id !== 1);

        this.usuariosNormales = usuarios
          .filter((u: any) => !u.provider || u.provider !== 'google')
          .map((u: any) => ({
            id: u.id,
            nombre: u.display_name,
            correo: u.email,
            rol: 'Usuario'
          }));

        this.usuariosGoogle = usuarios
          .filter((u: any) => u.provider === 'google')
          .map((u: any) => ({
            id: u.id,
            nombre: u.display_name,
            correo: u.email,
            rol: 'Usuario'
          }));
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }

  // ✅ NUEVO método POST con HttpClient
  enviarAlerta(correo: string) {
  const url = `http://3.223.148.111:8000/api/alerts/check-alerts/${correo}`;
  const body = {
    admin_email: 'polarsoftsenss@gmail.com'
  };

  this.http.post(url, body).subscribe({
    next: (res) => {
      console.log('✅ Alerta enviada:', res);
      Swal.fire({
        icon: 'success',
        title: 'Alerta enviada',
        text: `La alerta fue enviada correctamente a ${correo}`,
        confirmButtonColor: '#1f3a2e'
      });
    },
    error: (err) => {
      console.error('❌ Error al enviar alerta:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: `No se pudo enviar la alerta a ${correo}`,
        confirmButtonColor: '#d33'
      });
    }
  });
}

  get filasVaciasNormales(): any[] {
    const faltantes = 5 - (this.usuariosNormales?.length || 0);
    return Array.from({ length: Math.max(faltantes, 0) });
  }

  get filasVaciasGoogle(): any[] {
    const faltantes = 5 - (this.usuariosGoogle?.length || 0);
    return Array.from({ length: Math.max(faltantes, 0) });
  }
}
