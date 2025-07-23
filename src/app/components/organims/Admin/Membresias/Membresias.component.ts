import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/User.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';
import { User } from '../../../../Interface/Membresia'; // ajusta si tu path es diferente

@Component({
  selector: 'app-Membresias',
  templateUrl: './Membresias.component.html',
  standalone: true,
  imports: [HttpClientModule, NgClass, NgFor, SideNavAdminComponent, FormsModule],
})
export class MembresiasComponent implements OnInit {
  usuarios: (User & { 
    nombre?: string; 
    correo?: string; 
    foto?: string; 
    rol?: string; 
    membresiaActiva: boolean 
  })[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
  this.userService.getUsers().subscribe({
    next: (data) => {
      this.usuarios = data
        .filter((u) => u.id !== 1) // Excluir admin
        .map((u) => ({
          ...u,
          nombre: u.display_name,
          correo: u.email,
          foto: u.photo_url,
          rol: 'Usuario',
          membresiaActiva: u.membership_type === 'premium',
        }));
    },
    error: (err) => {
      console.error('Error al obtener usuarios:', err);
    },
  });
}


  cambiarEstadoMembresia(usuario: any) {
  const estabaActivo = usuario.membership_type === 'premium';

  if (!estabaActivo) {
    // Cambiar de free a premium
    this.userService.upgradeToPremium(usuario.id).subscribe({
      next: () => {
        console.log(`${usuario.nombre} actualizado a Premium`);
        usuario.membership_type = 'premium';
      },
      error: (err) => {
        console.error('Error al cambiar a Premium', err);
      },
    });
  } else {
    // Cambiar de premium a free
    this.userService.downgradeToFree(usuario.id).subscribe({
      next: () => {
        console.log(`${usuario.nombre} degradado a Free`);
        usuario.membership_type = 'free';
      },
      error: (err) => {
        console.error('Error al cambiar a Free', err);
      },
    });
  }
}


  get filasVacias(): any[] {
  const faltantes = 5 - this.usuarios.length;
  return Array(faltantes > 0 ? faltantes : 0);
}

}
