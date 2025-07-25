import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { NovedadesService } from '../../../../services/Novedades.service';
import { Novedad } from '../../../../Interface/Novedad';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [NgFor, SideNavComponent,DatePipe,NgIf],
  templateUrl: './Novedades.component.html',
})
export class NovedadesComponent implements OnInit {
 novedades: Novedad[] = [];
  novedadReciente: Novedad | null = null;

  constructor(private novedadesService: NovedadesService) {}

  ngOnInit(): void {
    this.novedadesService.getAll().subscribe({
      next: (data) => {
        // Ordenar por fecha descendente
        this.novedades = data.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        // La más reciente
        this.novedadReciente = this.novedades[0];
      },
      error: (err) => {
        console.error('Error al cargar novedades:', err);
      }
    });
  }
}
