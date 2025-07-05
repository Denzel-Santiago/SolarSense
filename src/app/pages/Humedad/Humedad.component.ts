import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SideNavComponent } from '../../components/organims/sidenav/sidenav.component';


@Component({
  selector: 'app-Humedad',
  templateUrl: './Humedad.component.html',
  imports: [ChartModule,SideNavComponent],
  standalone: true
})
export class HumedadComponent implements OnInit {

  humedadChart: any;
  

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    
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

    
  }
}
