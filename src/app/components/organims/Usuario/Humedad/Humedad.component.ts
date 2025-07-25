// Humedad.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsHumedadService } from '../../../../services/Humedad.service';
import { SensorService } from '../../../../services/sensor.service';
import { NgClass, NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
})
export class HumedadComponent implements OnInit {
  humedadChart: any;
  humedadActual: number = 0;
  sensorConectado: boolean = false;
  colorEstado: string = 'bg-gray-200';

  mostrarStats = false;
  statsData: any = null;

  distribucionChart: any;
  diasDistribucion: number = 1;
  errorDias: boolean = false;

  private wsService = inject(WsHumedadService);
  private sensorService = inject(SensorService);

  private maxPuntos = 20;
  private etiquetas: string[] = [];
  private valores: number[] = [];

  sensores: any[] = []; // para tabla

  ngOnInit() {
    this.iniciarGrafica();
    this.initDistribucionChart();
    this.cargarDistribucion(this.diasDistribucion);

    this.wsService.getMessages().subscribe((data) => {
      if (!data?.humedad || !data?.timestamp) return;

      const humedad = data.humedad;
      const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString();

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

    // Datos para tabla
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
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
              text: 'Humedad (%)',
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
    this.sensorService.getHumidityDistribution(dias).subscribe({
      next: (dist) => {
        if (!dist?.distribution?.x?.length || !dist?.distribution?.y?.length) return;

        this.distribucionChart = {
          ...this.distribucionChart,
          data: {
            labels: dist.distribution.x.map((v: number) => v.toFixed(2)),
            datasets: [
              {
                label: 'Distribución de Humedad',
                data: dist.distribution.y,
                borderColor: '#26C6DA',
                backgroundColor: 'rgba(38, 198, 218, 0.2)',
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
        console.error('Error al obtener distribución de humedad:', err);
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
