import { Routes } from '@angular/router';

import { LoginComponent } from './pages/Login/Login.component';
import { UsuarioDashComponent } from './components/organims/Usuario/UsuarioDash/UsuarioDash.component';
import { VoltajeComponent } from './components/organims/Usuario/Voltaje/Voltaje.component';
import { HumedadComponent } from './components/organims/Usuario/Humedad/Humedad.component';
import { TemperaturaComponent } from './components/organims/Usuario/Temperatura/Temperatura.component';
import { PresionAtmosfericaComponent } from './components/organims/Usuario/PresionAtmosferica/PresionAtmosferica.component';
import { SensoresComponent } from './pages/Sensores/Sensores.component'; 
import { NovedadesComponent } from './components/organims/Usuario/Novedades/Novedades.component';
import { PerfilComponent } from './components/organims/Usuario/Perfil/Perfil.component';
import { HomeComponent } from './pages/Home/Home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Home', component: HomeComponent },

  {
    path: 'Sensores',
    component: SensoresComponent,
    children: [
      { path: 'Voltaje', component: VoltajeComponent },
      { path: 'Humedad', component: HumedadComponent },
      { path: 'Temperatura', component: TemperaturaComponent },
      { path: 'UsuarioDash', component: UsuarioDashComponent },
      { path: 'PresionAtmosferica', component: PresionAtmosfericaComponent },
      { path: 'Novedades', component: NovedadesComponent },
      { path: 'Perfil', component: PerfilComponent },


      { path: '', redirectTo: 'UsuarioDash', pathMatch: 'full' } 
    ]
  }
];
