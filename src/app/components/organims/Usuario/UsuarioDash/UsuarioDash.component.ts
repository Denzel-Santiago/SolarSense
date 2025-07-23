import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsIna219Service } from '../../../../services/Voltaje.service';
import { WsPresionService } from '../../../../services/Presion.service';
import { WsHumedadService } from '../../../../services/Humedad.service';
import { WsTemperaturaService } from '../../../../services/Temperatura.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './UsuarioDash.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent],
})
export class UsuarioDashComponent implements OnInit, OnDestroy {
  voltajeChart: any;
  presionChart: any;
  humedadChart: any;
  temperaturaChart: any;

temperaturaActual: number = 0;
humedadActual: number = 0;
presionActual: number = 0;
voltajeActual: number = 0;


  private voltajeData: number[] = [];
  private presionData: number[] = [];
  private humedadData: number[] = [];
  private temperaturaData: number[] = [];

  private labels: string[] = [];

  private voltajeSub!: Subscription;
  private presionSub!: Subscription;
  private humedadSub!: Subscription;
  private temperaturaSub!: Subscription;

  private maxPoints = 10;

  constructor(
    private wsIna: WsIna219Service,
    private wsPresion: WsPresionService,
    private wsHumedad: WsHumedadService,
    private wsTemperatura: WsTemperaturaService
  ) {}

  ngOnInit() {
    this.initCharts();

    this.voltajeSub = this.wsIna.getMessages().subscribe((data) => {
  this.voltajeActual = data.voltaje;
  this.pushData(this.voltajeData, data.voltaje);
  this.updateChart(this.voltajeChart, this.voltajeData, 'Voltaje');
});

this.presionSub = this.wsPresion.getMessages().subscribe((data) => {
  this.presionActual = data.presion;
  this.pushData(this.presionData, data.presion);
  this.updateChart(this.presionChart, this.presionData, 'Presión (hPa)');
});

this.humedadSub = this.wsHumedad.getMessages().subscribe((data) => {
  this.humedadActual = data.humedad;
  this.pushData(this.humedadData, data.humedad);
  this.updateChart(this.humedadChart, this.humedadData, 'Humedad (%)');
});

this.temperaturaSub = this.wsTemperatura.getMessages().subscribe((data) => {
  this.temperaturaActual = data.temperatura;
  this.pushData(this.temperaturaData, data.temperatura);
  this.updateChart(this.temperaturaChart, this.temperaturaData, 'Temperatura (°C)');
});

  }

  initCharts() {
    this.voltajeChart = this.createLineChart('Voltaje', '#42A5F5');
    this.presionChart = this.createLineChart('Presión (hPa)', '#FFA726');
    this.humedadChart = this.createLineChart('Humedad (%)', '#26C6DA');
    this.temperaturaChart = this.createLineChart('Temperatura (°C)', '#AB47BC');
  }

  createLineChart(label: string, color: string) {
    return {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label,
            data: [],
            borderColor: color,
            backgroundColor: `${color}33`, // color con opacidad
            fill: true,
            tension: 0.3,
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
            ticks: { color: '#374151' },
          },
          y: {
            ticks: { color: '#374151' },
          },
        },
      },
    };
  }

  pushData(array: number[], value: number) {
    const time = new Date().toLocaleTimeString();
    this.labels.push(time);
    array.push(value);
    if (array.length > this.maxPoints) {
      array.shift();
      this.labels.shift();
    }
  }

  updateChart(chart: any, dataArray: number[], label: string) {
  chart.data = {
    ...chart.data,
    labels: [...this.labels],
    datasets: [
      {
        ...chart.data.datasets[0],
        label: label,
        data: [...dataArray],
      },
    ],
  };
}

  ngOnDestroy(): void {
    this.voltajeSub?.unsubscribe();
    this.presionSub?.unsubscribe();
    this.humedadSub?.unsubscribe();
    this.temperaturaSub?.unsubscribe();
  }
}
