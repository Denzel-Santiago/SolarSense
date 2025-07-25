import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';
import { UserService } from '../../../../services/User.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './Lista-Usuarios.component.html',
  standalone: true,
  imports: [NgIf, HttpClientModule, NgClass, NgFor, SideNavAdminComponent, FormsModule]
})
export class ListaUsuariosComponent implements OnInit {
  usuariosNormales: any[] = [];
  usuariosGoogle: any[] = [];

  modalAbierto = false;
  usuarioSeleccionado: any = {};
  esNuevoUsuario = false;

  constructor(private userService: UserService) {}

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

  eliminarUsuario(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.usuariosNormales = this.usuariosNormales.filter(u => u.id !== id);
        this.usuariosGoogle = this.usuariosGoogle.filter(u => u.id !== id);
      },
      error: (err) => console.error('Error al eliminar usuario:', err)
    });
  }

 abrirModal(usuario: any) {
  if (usuario.provider === 'google') {
    console.warn('Usuario de Google: no editable');
    return;
  }

  this.esNuevoUsuario = false;
  this.usuarioSeleccionado = {
    id: usuario.id,
    username: usuario.nombre,
    email: usuario.correo
  };
  this.modalAbierto = true;
}


  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = {};
  }

  guardarCambios() {
  if (!this.usuarioSeleccionado?.id) {
    console.error('❌ Usuario seleccionado no válido');
    return;
  }

  const payload = {
    username: this.usuarioSeleccionado.username,
    email: this.usuarioSeleccionado.email
  };

  this.userService.updateUser(this.usuarioSeleccionado.id, payload).subscribe({
    next: () => {
      this.obtenerUsuarios(); // recargar lista completa
      this.cerrarModal();
    },
    error: (err) => console.error('Error al actualizar usuario:', err)
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
