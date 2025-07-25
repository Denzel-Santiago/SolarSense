//Temperatura.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { NgClass, NgIf } from '@angular/common';
import { WsTemperaturaService } from '../../../../services/Temperatura.service';
import { SensorService } from '../../../../services/sensor.service';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-Temperatura',
  templateUrl: './Temperatura.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent, NgClass, NgIf,FormsModule],
})
export class TemperaturaComponent implements OnInit {
  temperaturaChart: any;
  temperaturaActual: number = 0;
  sensorConectado = false;
  colorEstado = '';

  mostrarStats = false;
  statsData: any = null;

  distribucionChart: any;
  diasDistribucion: number = 1;
  errorDias: boolean = false;

  private wsService = inject(WsTemperaturaService);
  private sensorService = inject(SensorService);

  private maxPuntos = 20;
  private etiquetas: string[] = [];
  private temperaturas: number[] = [];

  ngOnInit() {
    this.initChart();
    this.initDistribucionChart();
    this.cargarDistribucion(this.diasDistribucion);

    this.wsService.getMessages().subscribe((data) => {
      if (!data?.temperatura || !data?.timestamp) return;

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
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  }

  initDistribucionChart() {
    this.distribucionChart = {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '',
            font: { size: 16 },
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `Probabilidad: ${ctx.parsed.y.toFixed(4)}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Temperatura (°C)',
              font: { size: 14, weight: 'bold' },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Densidad de Probabilidad',
              font: { size: 14, weight: 'bold' },
            },
            beginAtZero: true,
          },
        },
      },
    };
  }

  cargarDistribucion(dias: number) {
    this.sensorService.getTemperatureDistribution(dias).subscribe({
      next: (dist) => {
        if (!dist?.distribution?.x?.length || !dist?.distribution?.y?.length) return;

        this.distribucionChart = {
          ...this.distribucionChart,
          data: {
            labels: dist.distribution.x.map((v: number) => v.toFixed(2)),
            datasets: [
              {
                label: 'Distribución de Temperatura',
                data: dist.distribution.y,
                borderColor: '#AB47BC',
                backgroundColor: 'rgba(171, 71, 188, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          },
          options: {
            ...this.distribucionChart.options,
            plugins: {
              ...this.distribucionChart.options.plugins,
              title: {
                display: true,
                text: `Distribución Normal — Media: ${dist.distribution.mean.toFixed(
                  2
                )}, Desv. Estándar: ${dist.distribution.std.toFixed(2)}`,
                font: { size: 16 },
              },
            },
          },
        };
      },
      error: (err) => {
        console.error('Error al obtener distribución de temperatura:', err);
      },
    });
  }

  actualizarDistribucion() {
    if (this.diasDistribucion < 1 || this.diasDistribucion > 7) {
      this.errorDias = true;
      return;
    }
    this.errorDias = false;
    this.cargarDistribucion(this.diasDistribucion);
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
