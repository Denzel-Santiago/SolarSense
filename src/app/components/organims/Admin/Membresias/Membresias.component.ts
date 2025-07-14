import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';

@Component({
  selector: 'app-Membresias',
  templateUrl: './Membresias.component.html',
  standalone: true,
  imports: [ HttpClientModule, NgClass, NgFor, SideNavAdminComponent, FormsModule]
})
export class MembresiasComponent {
   usuarios = [
    { id: 1, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario', membresiaActiva: false },
    { id: 2, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario', membresiaActiva: true },
    { id: 3, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario', membresiaActiva: false },
    { id: 4, nombre: 'Victor', correo: 'Vic@gmail.com', rol: 'Usuario', membresiaActiva: true }
  ];


  cambiarEstadoMembresia(usuario: any) {
    // Aquí puedes implementar la lógica para guardar el cambio en tu backend
    console.log(`Membresía de ${usuario.nombre} cambiada a: ${usuario.membresiaActiva}`);
  }
  
}