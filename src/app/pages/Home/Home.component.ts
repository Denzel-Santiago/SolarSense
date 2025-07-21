// home.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {}