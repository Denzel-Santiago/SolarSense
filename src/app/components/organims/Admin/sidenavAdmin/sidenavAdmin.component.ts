import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { SideNavService } from '../../../../services/side-nav.service';

@Component({
  selector: 'app-side-nav-Admin',
  templateUrl: './sidenavAdmin.component.html',
  standalone: true,
  imports: [NgFor, NgIf]
})
export class SideNavAdminComponent implements OnInit, OnDestroy {
  menuItems = [
    { icon: 'assets/usuario.png', label: 'Lista-Usuarios' },
    { icon: 'assets/card.png', label: 'Membresias' },
    { icon: 'assets/novedad.png', label: 'Novedades' },
    { icon: 'assets/alert.png', label: 'Alerta' },
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
      case 'Lista-Usuarios':
        this.router.navigate(['/Lista-Usuarios']);
        break;
      case 'Membresias':
        this.router.navigate(['Membresias']);
        break;
      case 'Novedades':
        this.router.navigate(['Novedades-Admin']);
        break;
        case 'Alerta':
        this.router.navigate(['Alerta']);
        break;
    }
  }
}
