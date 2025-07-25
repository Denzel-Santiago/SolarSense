import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { NgClass, NgIf } from '@angular/common';
import { WsTemperaturaService } from '../../../../services/Temperatura.service';
import { SensorService } from '../../../../services/sensor.service';

@Component({
  selector: 'app-Temperatura',
  templateUrl: './Temperatura.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent, NgClass, NgIf],
})
export class TemperaturaComponent implements OnInit {
  temperaturaChart: any;
  temperaturaActual: number = 0;
  sensorConectado = false;
  colorEstado = '';

  private wsService = inject(WsTemperaturaService);
  private sensorService = inject(SensorService);

  private maxPuntos = 20;
  private etiquetas: string[] = [];
  private temperaturas: number[] = [];

  mostrarStats = false;
  statsData: any = null;

  ngOnInit() {
    this.initChart();

    this.wsService.getMessages().subscribe((data) => {
      const temperatura = data.temperatura;
      const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString();

      this.temperaturaActual = temperatura;
      this.sensorConectado = true;
      this.colorEstado = this.definirColorPorTemperatura(temperatura);

      this.etiquetas.push(timestamp);
      this.temperaturas.push(temperatura);

      if (this.temperaturas.length > this.maxPuntos) {
        this.temperaturas.shift();
        this.etiquetas.shift();
      }

      this.temperaturaChart = {
        ...this.temperaturaChart,
        data: {
          labels: [...this.etiquetas],
          datasets: [
            {
              label: 'Temperatura (°C)',
              data: [...this.temperaturas],
              borderColor: '#AB47BC',
              backgroundColor: 'rgba(171, 71, 188, 0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        },
      };
    });
  }

  initChart() {
    this.temperaturaChart = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: [],
            borderColor: '#AB47BC',
            backgroundColor: 'rgba(171, 71, 188, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
    };
  }

  definirColorPorTemperatura(valor: number): string {
    if (valor <= 10) return 'bg-blue-200';
    if (valor <= 25) return 'bg-yellow-200';
    return 'bg-red-200';
  }

  obtenerStatsTemperatura() {
    this.sensorService.getTemperatureStats().subscribe({
      next: (data) => {
        this.statsData = data.basic_stats;
        this.mostrarStats = true;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas de temperatura:', err);
      },
    });
  }
}
