import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,
  imports: [NgFor, NgIf]
})
export class SideNavComponent {
  isExpanded = false;

  menuItems = [
    { icon: 'assets/novedad.png', label: 'Novedades' },
    { icon: 'assets/home.png', label: 'Dashboard' },
    { icon: 'assets/voltaje.png', label: 'Voltaje' },
    { icon: 'assets/presion.png', label: 'Presion Atmosferica' },
    { icon: 'assets/humedad.png', label: 'Humedad' },
    { icon: 'assets/temperatura.png', label: 'Temperatura' },
    { icon: 'assets/usuario.png', label: 'Perfil'},
    { icon: 'assets/salir.png', label: 'Salir'}
  ];

  constructor(private router: Router) {}

  toggleNav() {
    this.isExpanded = !this.isExpanded;
  }

  handleItemClick(item: any) {
    if (item.label === 'Salir') {
      this.router.navigate(['']);
    } else if (item.label === 'Home') {
      this.router.navigate(['home']);
    } 
    else if (item.label === 'Dashboard') {
      this.router.navigate(['UsuarioDash']);
    } 
    else if (item.label === 'Voltaje') {
      this.router.navigate(['Voltaje']);
    } 
     else if (item.label === 'Humedad') {
      this.router.navigate(['Humedad']);
    } 
    else if (item.label === 'Temperatura') {
      this.router.navigate(['Temperatura']);
    } 
    else if (item.label === 'Presion Atmosferica') {
      this.router.navigate(['PresionAtmosferica']);
    } 
    /*
    
   
    else if (item.label === '') {
      this.router.navigate(['']);
    } 
    else if (item.label === 'Usuarios') {
      this.router.navigate(['usuarios']);
    } 
    else if (item.label === 'Permisos') {
      this.router.navigate(['tipos-permiso']);
    } 
    else if (item.label === 'Rol_Permiso') {
      this.router.navigate(['permisos-roles']);
    }


    */
}
}

