import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-Noticias',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, NgFor, NgIf,NgClass],
  templateUrl: './Noticias.component.html',
})
export class NoticiasComponent implements OnInit {
  currentSlide = 0;
  menuAbierto = false;

  images: string[] = [
    'assets/Noticias/Noticia1.png',
    'assets/Noticias/Noticia2.png',
    'assets/Noticias/Noticia3.png',
    'assets/Noticias/Noticia4.png',

  ];

  ngOnInit(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.images.length;
    }, 4000); // cambia cada 4 segundos
  }

   tips = [
    {
      icon: 'assets/Tips/Sol.png',
      title: 'Revisa el sistema cada mañana',
      description: 'Haz una revisión rápida del dashboard por las mañanas. Así puedes detectar posibles fallos en los sensores o producción anómala desde el inicio del día.'
    },
    {
      icon: 'assets/Tips/panel.png',
      title: 'Limpia los paneles cada 2 a 4 semanas',
      description: 'El polvo, hojas o suciedad pueden reducir hasta un 25% la eficiencia. Un simple paño o manguera puede mejorar tu rendimiento solar sin gastar más.'
    },
    {
      icon: 'assets/Tips/wifi.png',
      title: 'Verifica la conexión WiFi',
      description: 'Asegúrate de que la Raspberry Pi tenga una señal estable. Una mala conexión puede interrumpir el envío de datos o retrasar alertas importantes.'
    },
    {
      icon: 'assets/Tips/temp.png',
      title: 'Presta atención a la temperatura',
      description: 'Temperaturas muy altas pueden reducir la eficiencia de tus paneles. Si superan los 60 °C, considera sombra parcial o ventilación pasiva.'
    },
    {
      icon: 'assets/Tips/info.png',
      title: 'Usa los informes semanales',
      description: 'Descarga tus reportes en PDF o CSV y compáralos semana a semana. Así podrás identificar patrones o tomar decisiones de mantenimiento a tiempo.'
    },
    {
      icon: 'assets/Tips/reinicio.png',
      title: 'Reinicia el sistema cada 15 días',
      description: 'Reiniciar la Raspberry Pi de forma segura ayuda a mantener un rendimiento estable y evita acumulación de procesos o errores.'
    },
  ];

  selectedTip: any = null;

  openTip(tip: any) {
    this.selectedTip = tip;
  }

  closeTip() {
    this.selectedTip = null;
  }

}
