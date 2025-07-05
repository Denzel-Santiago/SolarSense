import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../components/organims/sidenav/sidenav.component';


@Component({
  selector: 'app-Temperatura',
  templateUrl: './Temperatura.component.html',
  imports: [ChartModule,SideNavComponent],
  standalone: true
})
export class TemperaturaComponent implements OnInit {

  temperaturaChart: any;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
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
