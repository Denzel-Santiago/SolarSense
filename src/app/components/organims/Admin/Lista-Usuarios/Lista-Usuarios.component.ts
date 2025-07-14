import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './Lista-Usuarios.component.html',
  standalone: true,
  imports: [NgIf, HttpClientModule, NgClass, NgFor, SideNavAdminComponent, FormsModule]
})
export class ListaUsuariosComponent {
  usuarios = [
    { id: 1, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario' },
    { id: 2, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario' },
    { id: 3, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario' },
    { id: 4, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario' }
  ];

  modalAbierto = false;
  usuarioSeleccionado: any = {};
  esNuevoUsuario = false;

  eliminarUsuario(id: number) {
    this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
  }

  abrirModal(usuario: any) {
    this.esNuevoUsuario = false;
    this.usuarioSeleccionado = { ...usuario }; // Copia para edición
    this.modalAbierto = true;
  }

  abrirModalNuevo() {
    this.esNuevoUsuario = true;
    this.usuarioSeleccionado = {
      id: this.generarNuevoId(),
      nombre: '',
      correo: '',
      rol: 'Usuario'
    };
    this.modalAbierto = true;
  }

  generarNuevoId(): number {
    const maxId = Math.max(...this.usuarios.map(u => u.id), 0);
    return maxId + 1;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = {};
  }

  guardarCambios() {
    if (this.esNuevoUsuario) {
      // Agregar nuevo usuario
      this.usuarios.push({ ...this.usuarioSeleccionado });
    } else {
      // Editar usuario existente
      const index = this.usuarios.findIndex(u => u.id === this.usuarioSeleccionado.id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuarioSeleccionado };
      }
    }
    this.cerrarModal();
  }
}