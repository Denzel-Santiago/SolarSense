// home.component.ts
import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, NgIf,NgClass],
  templateUrl: './Home.component.html',
})
export class HomeComponent {
menuAbierto = false;
modalAbierto: boolean = false;

abrirModal() {
  this.modalAbierto = true;
}

cerrarModal() {
  this.modalAbierto = false;
}



}