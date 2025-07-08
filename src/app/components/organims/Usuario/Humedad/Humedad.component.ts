import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { WsHumedadService } from '../../../../services/Humedad.service';

@Component({
  selector: 'app-Humedad',
  templateUrl: './Humedad.component.html',
  standalone: true,
  imports: [ChartModule, SideNavComponent],
})
export class HumedadComponent implements OnInit {
  humedadChart: any;

  private wsService = inject(WsHumedadService);
  private maxPuntos = 20;

  private etiquetas: string[] = [];
  private valores: number[] = [];

  ngOnInit() {
    this.iniciarGrafica();

    this.wsService.connect().subscribe((data) => {
      const humedad = data.humedad;
      const timestamp = new Date(data.timestamp * 1000).toLocaleTimeString();

      // Añadir nuevos datos
      this.etiquetas.push(timestamp);
      this.valores.push(humedad);

      // Limitar a últimos N puntos
      if (this.etiquetas.length > this.maxPuntos) {
        this.etiquetas.shift();
        this.valores.shift();
      }

      // Actualizar gráfica
      this.humedadChart.data.labels = [...this.etiquetas];
      this.humedadChart.data.datasets[0].data = [...this.valores];
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
            fill: true,
            backgroundColor: 'rgba(38, 198, 218, 0.2)',
            tension: 0.4
          }
        ]
      }
    };
  }
}
