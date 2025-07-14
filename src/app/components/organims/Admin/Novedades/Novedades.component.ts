import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';

@Component({
  selector: 'app-novedades-Admin',
  standalone: true,
  templateUrl: './Novedades.component.html',
  imports: [NgFor,SideNavAdminComponent]
})
export class NovedadesAdminComponent {
  novedades = [
    {
      titulo: 'ULTIMAS ACTUALIZACIONES',
      descripcion: 'Gracias a nuestra interfaz web moderna y visual, desarrollada con tecnología Angular, podrá ver nuestras mas recientes actualizaciones del sistema detalladamente.',
      hora: 'THU 14:22'
    },
    {
      titulo: 'ULTIMAS ACTUALIZACIONES',
      descripcion: 'Gracias a nuestra interfaz web moderna y visual, desarrollada con tecnología Angular, podrá ver nuestras mas recientes actualizaciones del sistema detalladamente.',
      hora: 'THU 14:22'
    }
  ];

  editar(index: number) {
    alert('Editar novedad #' + index);
  }

  eliminar(index: number) {
    this.novedades.splice(index, 1);
  }
}
