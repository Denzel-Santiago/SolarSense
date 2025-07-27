import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class SideNavComponent implements OnInit, OnDestroy {
  menuItems = [
    { icon: 'assets/novedad.png', label: 'Novedades' },
    { icon: 'assets/home.png', label: 'Dashboard' },
    { icon: 'assets/voltaje.png', label: 'Voltaje' },
    { icon: 'assets/presion.png', label: 'Presion Atmosferica' },
    { icon: 'assets/humedad.png', label: 'Humedad' },
    { icon: 'assets/temperatura.png', label: 'Temperatura' },
    { icon: 'assets/usuario.png', label: 'Perfil' },
    { icon: 'assets/PDF.png', label: 'Reporte' },
    { icon: 'assets/salir.png', label: 'Salir' }
  ];

  isMobile: boolean = false;
  isDrawerOpen: boolean = false;
  private resizeListener: any;

  constructor(
    private router: Router,
    public sideNavService: SideNavService
  ) {}

  ngOnInit() {
    this.checkIfMobile();
    this.resizeListener = () => this.checkIfMobile();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 640;
  }

  toggleNav() {
    this.sideNavService.toggle();
  }

  get isExpanded() {
    return this.sideNavService.getExpanded();
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  handleItemClick(item: any) {
    switch (item.label) {
      case 'Salir':
        this.router.navigate(['']);
        break;
      case 'Dashboard':
        this.router.navigate(['Sensores/UsuarioDash']);
        break;
      case 'Voltaje':
        this.router.navigate(['Sensores/Voltaje']);
        break;
      case 'Humedad':
        this.router.navigate(['Sensores/Humedad']);
        break;
      case 'Temperatura':
        this.router.navigate(['Sensores/Temperatura']);
        break;
      case 'Presion Atmosferica':
        this.router.navigate(['Sensores/PresionAtmosferica']);
        break;
      case 'Novedades':
        this.router.navigate(['Sensores/Novedades']);
        break;
      case 'Perfil':
        this.router.navigate(['Sensores/Perfil']);
        break;
        case 'Reporte':
        this.router.navigate(['Sensores/Reporte']);
        break;
    }
  }
}
