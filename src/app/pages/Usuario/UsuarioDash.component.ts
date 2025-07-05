import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../components/organims/sidenav/sidenav.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './UsuarioDash.component.html',
  imports: [ChartModule,SideNavComponent],
  standalone: true
})
export class UsuarioDashComponent implements OnInit {

  voltajeChart: any;
  presionChart: any;
  humedadChart: any;
  temperaturaChart: any;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    this.voltajeChart = {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Voltaje',
            data: [3.2, 3.5, 3.3, 3.4, 3.6, 3.7],
            borderColor: '#42A5F5',
            fill: false
          }
        ]
      }
    };

    this.presionChart = {
      type: 'bar',
      data: {
        labels: ['Sensor 1', 'Sensor 2', 'Sensor 3'],
        datasets: [
          {
            label: 'Presión (hPa)',
            data: [1010, 1012, 1008],
            backgroundColor: ['#FFA726', '#66BB6A', '#EF5350']
          }
        ]
      }
    };

    this.humedadChart = {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
        datasets: [
          {
            label: 'Humedad (%)',
            data: [60, 65, 70, 72, 68],
            borderColor: '#26C6DA',
            fill: true,
            backgroundColor: 'rgba(38, 198, 218, 0.2)'
          }
        ]
      }
    };

    this.temperaturaChart = {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: [24, 26, 25, 27, 28],
            backgroundColor: '#AB47BC'
          }
        ]
      }
    };
  }
}
