import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { WsTemperaturaService } from '../../../../services/Temperatura.service';

@Component({
  selector: 'app-Temperatura',
  templateUrl: './Temperatura.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent, NgClass],
})
export class TemperaturaComponent implements OnInit {
  temperaturaChart: any;
  temperaturaActual: number = 0;
  sensorConectado = false;
  colorEstado = '';

  private wsService = inject(WsTemperaturaService);
  private maxPuntos = 20;
  private etiquetas: string[] = [];
  private temperaturas: number[] = [];
  private timeoutRef: any;

  ngOnInit() {
    this.initChart();

    this.wsService.getMessages().subscribe((data) => {
      const temperatura = data.temperatura;
      const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString();

      this.temperaturaActual = temperatura;
      this.sensorConectado = true;

      clearTimeout(this.timeoutRef);
      this.timeoutRef = setTimeout(() => {
        this.sensorConectado = false;
      }, 5000);

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
}
