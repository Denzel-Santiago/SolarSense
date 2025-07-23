import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { SideNavService } from '../../../../services/side-nav.service';

@Component({
  selector: 'app-side-nav-Admin',
  templateUrl: './sidenavAdmin.component.html',
  standalone: true,
  imports: [NgFor, NgIf]
})
export class SideNavAdminComponent {
  menuItems = [
    { icon: 'assets/usuario.png', label: 'Lista-Usuarios' },
    { icon: 'assets/card.png', label: 'Membresias' },
    { icon: 'assets/novedad.png', label: 'Novedades' },
    { icon: 'assets/alert.png', label: 'Alerta' },
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
    } else if (item.label === 'Lista-Usuarios') {
      this.router.navigate(['/Lista-Usuarios']);
    } else if (item.label === 'Membresias') {
      this.router.navigate(['Membresias']);
    } else if (item.label === 'Novedades') {
      this.router.navigate(['Novedades-Admin']);
    } else if (item.label === 'Temperatura') {
      this.router.navigate(['Sensores/']);
    }
    
    
}
}

