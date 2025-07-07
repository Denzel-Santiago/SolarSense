import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { SideNavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [ NgFor,SideNavComponent],
  templateUrl: './novedades.component.html',
})
export class NovedadesComponent {
  updates = [
    {
      titulo: 'ACTUALIZACION 05',
      descripcion: 'Gracias a nuestra interfaz web moderna y visual, desarrollada con tecnología Angular, podrá ver nuestras más recientes actualizaciones del sistema detalladamente.'
    }
  ];

  historial = [
    {
      titulo: 'ACTUALIZACION',
      fecha: '02',
      cambios: ['Cambios realizados', 'Correcciones de errores', 'Mejoras en el sistema']
    },
    {
      titulo: 'ACTUALIZACION',
      fecha: '02',
      cambios: ['Cambios realizados', 'Correcciones de errores', 'Mejoras en el sistema']
    }
  ];
}
