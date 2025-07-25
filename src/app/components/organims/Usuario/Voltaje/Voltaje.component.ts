//Voltaje.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsIna219Service } from '../../../../services/Voltaje.service';
import { Subscription } from 'rxjs';
import { SensorService } from '../../../../services/sensor.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-voltaje',
  templateUrl: './Voltaje.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent, NgClass, NgIf],
})
export class VoltajeComponent implements OnInit, OnDestroy {
  voltaje: number = 0;
  corriente: number = 0;
  potencia: number = 0;
  sensorConectado: boolean = false;

  inaChart: any;
  private subscription!: Subscription;

  private labels: string[] = [];
  private maxDataPoints = 20;
  private voltajeData: number[] = [];
  private corrienteData: number[] = [];
  private potenciaData: number[] = [];

  mostrarStats = false;
  statsData: any = null;

  constructor(
    private wsInaService: WsIna219Service,
    private sensorService: SensorService
  ) {}

  ngOnInit() {
    this.initChart();
    this.subscription = this.wsInaService.getMessages().subscribe((data) => {
      this.sensorConectado = true;

      this.voltaje = data.voltaje;
      this.corriente = data.corriente;
      this.potencia = data.potencia;

      const timestamp = new Date().toLocaleTimeString();
      this.labels.push(timestamp);
      this.voltajeData.push(this.voltaje);
      this.corrienteData.push(this.corriente);
      this.potenciaData.push(this.potencia);

      if (this.labels.length > this.maxDataPoints) {
        this.labels.shift();
        this.voltajeData.shift();
        this.corrienteData.shift();
        this.potenciaData.shift();
      }

      this.inaChart.data.labels = [...this.labels];
      this.inaChart.data.datasets[0].data = [...this.voltajeData];
      this.inaChart.data.datasets[1].data = [...this.corrienteData];
      this.inaChart.data.datasets[2].data = [...this.potenciaData];
    });
  }

  initChart() {
    this.inaChart = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Voltaje (V)',
            data: [],
            borderColor: '#42A5F5',
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Corriente (A)',
            data: [],
            borderColor: '#FF9800',
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Potencia (W)',
            data: [],
            borderColor: '#8E24AA',
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: {
            labels: {
              color: '#374151',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#374151',
            },
          },
          y: {
            ticks: {
              color: '#374151',
            },
          },
        },
      },
    };
  }

  obtenerStatsVoltaje() {
    this.sensorService.getVoltageStats().subscribe({
      next: (data) => {
        this.statsData = data.basic_stats;
        this.mostrarStats = true;
      },
      error: (err) => {
        console.error('Error al obtener estadísticas de voltaje:', err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
