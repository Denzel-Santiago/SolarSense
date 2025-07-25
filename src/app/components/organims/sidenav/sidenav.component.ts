import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { SideNavService } from '../../../services/side-nav.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,
  imports: [NgFor, NgIf]
})
export class SideNavComponent {
  menuItems = [
    { icon: 'assets/novedad.png', label: 'Novedades' },
    { icon: 'assets/home.png', label: 'Dashboard' },
    { icon: 'assets/voltaje.png', label: 'Voltaje' },
    { icon: 'assets/presion.png', label: 'Presion Atmosferica' },
    { icon: 'assets/humedad.png', label: 'Humedad' },
    { icon: 'assets/temperatura.png', label: 'Temperatura' },
    { icon: 'assets/usuario.png', label: 'Perfil' },
    { icon: 'assets/salir.png', label: 'Salir' }
  ];

  constructor(
    private router: Router,
    public sideNavService: SideNavService
  ) {}

  toggleNav() {
    this.sideNavService.toggle();
  }

  get isExpanded() {
    return this.sideNavService.getExpanded();
  }

  handleItemClick(item: any) {
    if (item.label === 'Salir') {
      this.router.navigate(['']);
    } else if (item.label === 'Dashboard') {
      this.router.navigate(['Sensores/UsuarioDash']);
    } else if (item.label === 'Voltaje') {
      this.router.navigate(['Sensores/Voltaje']);
    } else if (item.label === 'Humedad') {
      this.router.navigate(['Sensores/Humedad']);
    } else if (item.label === 'Temperatura') {
      this.router.navigate(['Sensores/Temperatura']);
    } else if (item.label === 'Presion Atmosferica') {
      this.router.navigate(['Sensores/PresionAtmosferica']);
    } else if (item.label === 'Novedades') {
      this.router.navigate(['Sensores/Novedades']);
    }else if (item.label === 'Perfil') {
      this.router.navigate(['Sensores/Perfil']);
    }
    
    
}
}

