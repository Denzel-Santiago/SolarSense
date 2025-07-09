import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsPresionService } from '../../../../services/Presion.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-PresionAtmosferica',
  templateUrl: './PresionAtmosferica.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent, NgClass, NgIf],
})
export class PresionAtmosfericaComponent implements OnInit {
  presionChart: any;
  presionActual = 0;
  sensorConectado = false;
  humedadActual = 75; // Simulado, reemplazar si se integra con sensor real
  probabilidadLluvia = 'Desconocida';

  private wsService = inject(WsPresionService);
  private maxPuntos = 20;

  private etiquetas: string[] = [];
  private presiones: number[] = [];
  private timeoutRef: any;

  ngOnInit() {
    this.initChart();

    this.wsService.getMessages().subscribe((data) => {
      const presion = data.presion;
      const timestamp = new Date(data.timestamp * 5000).toLocaleTimeString();

      this.presionActual = presion;
      this.sensorConectado = true;

      clearTimeout(this.timeoutRef);
      this.timeoutRef = setTimeout(() => {
        this.sensorConectado = false;
      }, 5000);

      // Simulación de humedad (reemplaza por valor real si puedes)
      this.humedadActual = 75;
      this.probabilidadLluvia = this.calcularProbabilidadLluvia(this.humedadActual, this.presionActual);

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
              backgroundColor: 'rgba(255, 167, 38, 0.2)',
              fill: true,
              tension: 0.3
            }
          ]
        }
      };
    });
  }

  initChart() {
    this.presionChart = {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Presión (hPa)',
            data: [],
            borderColor: '#FFA726',
            backgroundColor: 'rgba(255, 167, 38, 0.2)',
            fill: true,
            tension: 0.3
          }
        ]
      }
    };
  }

  calcularProbabilidadLluvia(h: number, p: number): string {
    if (p < 1000 && h > 80) return 'Alta';
    else if (p < 1010 && h > 70) return 'Media';
    return 'Baja';
  }
}
