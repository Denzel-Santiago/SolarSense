//PresionAtmosferica.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsPresionService } from '../../../../services/Presion.service';
import { WsHumedadService } from '../../../../services/Humedad.service';
import { PresionGausService } from '../../../../services/PresionGaus.service';
import { SensorService } from '../../../../services/sensor.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-PresionAtmosferica',
  templateUrl: './PresionAtmosferica.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent, NgClass, NgIf],
})
export class PresionAtmosfericaComponent implements OnInit {
  presionChart: any;
  distribucionChart: any;

  humedadActual = 0;
  presionActual = 0;
  sensorConectado = false;
  probabilidadLluvia = 'Calculando...';

  mostrarStats = false;
  statsData: any = null;

  private wsPresionService = inject(WsPresionService);
  private wsHumedadService = inject(WsHumedadService);
  private gausService = inject(PresionGausService);
  private sensorService = inject(SensorService);

  private maxPuntos = 20;
  private etiquetas: string[] = [];
  private presiones: number[] = [];
  private timeoutRef: any;

  ngOnInit() {
    this.initPresionChart();
    this.initDistribucionChart();

    /* --- WebSocket de presión --- */
    this.wsPresionService.getMessages().subscribe((data) => {
      if (!data?.presion || !data?.timestamp) return;

      const presion = data.presion;
      const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString();

      this.presionActual = presion;
      this.sensorConectado = true;

      clearTimeout(this.timeoutRef);
      this.timeoutRef = setTimeout(() => (this.sensorConectado = false), 5000);

      this.etiquetas.push(timestamp);
      this.presiones.push(presion);

      if (this.presiones.length > this.maxPuntos) {
        this.presiones.shift();
        this.etiquetas.shift();
      }

      this.presionChart = {
        ...this.presionChart,
        data: {
          labels: [...this.etiquetas],
          datasets: [
            {
              label: 'Presión (hPa)',
              data: [...this.presiones],
              borderColor: '#FFA726',
              backgroundColor: 'rgba(255,167,38,0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        },
      };

      this.probabilidadLluvia = this.calcularProbabilidadLluvia(
        this.humedadActual,
        this.presionActual
      );
    });

    /* --- WebSocket de humedad --- */
    this.wsHumedadService.getMessages().subscribe((data) => {
      if (data?.humedad !== undefined) {
        this.humedadActual = data.humedad;
        this.probabilidadLluvia = this.calcularProbabilidadLluvia(
          this.humedadActual,
          this.presionActual
        );
      }
    });

    /* --- Distribución gaussiana --- */
    this.gausService.fetchDistribution(1).subscribe((dist) => {
      if (!dist?.x?.length || !dist?.y?.length) return;

      this.distribucionChart = {
        type: 'line',
        data: {
          labels: dist.x.map((v: number) => v.toFixed(2)),
          datasets: [
            {
              label: 'Distribución de Presión',
              data: dist.y,
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66,165,245,0.2)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Distribución Normal — Media: ${dist.mean.toFixed(
                2
              )}, Desv. Estándar: ${dist.std.toFixed(2)}`,
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
                text: 'Presión (hPa)',
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
    });
  }

  /* --- Inicializadores de gráfica --- */
  private initPresionChart() {
    this.presionChart = {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: { responsive: true, maintainAspectRatio: false },
    };
  }

  private initDistribucionChart() {
    this.distribucionChart = {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: { responsive: true, maintainAspectRatio: false },
    };
  }

  /* --- Botón de estadísticas --- */
  obtenerStatsPresion() {
    this.sensorService.getPressureStats().subscribe({
      next: (data) => {
        this.statsData = data.basic_stats;
        this.mostrarStats = true;
      },
      error: (err) =>
        console.error('Error al obtener estadísticas de presión:', err),
    });
  }

  /* --- Lógica para lluvia --- */
  private calcularProbabilidadLluvia(h: number, p: number): string {
    if (p < 1000 && h > 80) return 'Alta';
    if (p < 1010 && h > 70) return 'Media';
    return 'Baja';
  }
}
