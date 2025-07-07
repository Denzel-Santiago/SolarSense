import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../sidenav/sidenav.component';


@Component({
  selector: 'app-Voltaje',
  templateUrl: './Voltaje.component.html',
  imports: [ChartModule,SideNavComponent],
  standalone: true
})
export class VoltajeComponent implements OnInit {

  voltajeChart: any;

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
  }
}
