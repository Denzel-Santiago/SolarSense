//Humedad.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsHumedadService } from '../../../../services/Humedad.service';
import { SensorService } from '../../../../services/sensor.service';
import { NgClass, NgIf, NgForOf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-Humedad',
  templateUrl: './Humedad.component.html',
  standalone: true,
  imports: [
    ChartModule,
    SideNavComponent,
    NgClass,
    NgIf,
    NgForOf,
    CommonModule
  ],
})
export class HumedadComponent implements OnInit {
  humedadChart: any;
  humedadActual: number = 0;
  sensorConectado: boolean = false;
  colorEstado: string = 'bg-gray-200';

  private wsService = inject(WsHumedadService);
  private sensorService = inject(SensorService);

  private maxPuntos = 20;
  private etiquetas: string[] = [];
  private valores: number[] = [];

  mostrarStats = false;
  statsData: any = null;
  sensores: any[] = []; // <-- para la tabla de datos

  ngOnInit() {
    this.iniciarGrafica();

    this.wsService.getMessages().subscribe((data) => {
      const humedad = data.humedad;
      const timestamp = new Date(data.timestamp * 5000).toLocaleTimeString();

      this.etiquetas.push(timestamp);
      this.valores.push(humedad);

      if (this.etiquetas.length > this.maxPuntos) {
        this.etiquetas.shift();
        this.valores.shift();
      }

      this.humedadActual = humedad;
      this.sensorConectado = true;
      this.colorEstado = this.definirColorPorHumedad(humedad);

      this.humedadChart = {
        ...this.humedadChart,
        data: {
          labels: [...this.etiquetas],
          datasets: [
            {
              label: 'Humedad (%)',
              data: [...this.valores],
              borderColor: '#26C6DA',
              backgroundColor: 'rgba(38, 198, 218, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
      };
    });

    // Obtener datos para tabla
    this.sensorService.getHumidityStats().subscribe({
      next: (data) => this.sensores = data,
      error: (err) => console.error('Error al obtener datos de humedad:', err),
    });
  }

  iniciarGrafica() {
    this.humedadChart = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Humedad (%)',
            data: [],
            borderColor: '#26C6DA',
            backgroundColor: 'rgba(38, 198, 218, 0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
    };
  }

  definirColorPorHumedad(valor: number): string {
    if (valor <= 30) return 'bg-red-200';
    if (valor <= 60) return 'bg-yellow-200';
    return 'bg-green-200';
  }

  obtenerStatsHumedad() {
    this.sensorService.getHumidityStats().subscribe({
      next: (data) => {
        this.statsData = data.basic_stats;
        this.mostrarStats = true;
      },
      error: (err) => {
        console.error('Error obteniendo estadísticas:', err);
      },
    });
  }
}
