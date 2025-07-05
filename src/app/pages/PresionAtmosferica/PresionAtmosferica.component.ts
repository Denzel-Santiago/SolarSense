import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../components/organims/sidenav/sidenav.component';


@Component({
  selector: 'app-PresionAtmosferica',
  templateUrl: './PresionAtmosferica.component.html',
  imports: [ChartModule,SideNavComponent],
  standalone: true
})
export class PresionAtmosfericaComponent implements OnInit {

  presionChart: any;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    
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

  }
}
