import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { SideNavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, FormsModule,SideNavComponent,NgFor],
  templateUrl: './Perfil.component.html',
})
export class PerfilComponent {
  usuario = {
    nombre: 'VICTOR ALEJANDRO',
    usuario: 'VICTOO203',
    correo: 'VICTO@JULY.COM',
    imagen: '' // Base64 o URL
  };

  raspberries = [
    { nombre: 'EVA 001', icono: 'assets/rass.png' }
  ];

  modalAbierto = false;
  usuarioTemporal = { nombre: '', usuario: '', correo: '', imagen: '' };
  imagenPreview: string = '';

  abrirModal() {
    this.usuarioTemporal = { ...this.usuario };
    this.imagenPreview = this.usuario.imagen;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarCambios() {
    this.usuario = { ...this.usuarioTemporal, imagen: this.imagenPreview };
    this.cerrarModal();
  }

  subirImagen(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  }
}
