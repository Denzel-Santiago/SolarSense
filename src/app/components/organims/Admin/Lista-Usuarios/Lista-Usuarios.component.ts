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
    this.esNuevoUsuario = false;
    this.usuarioSeleccionado = { ...usuario };
    this.modalAbierto = true;
  }

  abrirModalNuevo() {
    this.esNuevoUsuario = true;
    this.usuarioSeleccionado = {
      id: 0,
      nombre: '',
      correo: '',
      rol: 'Usuario'
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = {};
  }

  guardarCambios() {
    if (this.esNuevoUsuario) {
      this.userService.createUser(this.usuarioSeleccionado).subscribe({
        next: (nuevoUsuario) => {
          this.usuariosNormales.push(nuevoUsuario);
          this.cerrarModal();
        },
        error: (err) => console.error('Error al crear usuario:', err)
      });
    } else {
      this.userService.updateUser(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
        next: (usuarioActualizado) => {
          const index = this.usuariosNormales.findIndex(u => u.id === usuarioActualizado.id);
          if (index !== -1) this.usuariosNormales[index] = usuarioActualizado;
          this.cerrarModal();
        },
        error: (err) => console.error('Error al actualizar usuario:', err)
      });
    }
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
