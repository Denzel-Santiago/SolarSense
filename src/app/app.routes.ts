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
import { ListaUsuariosComponent } from './components/organims/Admin/Lista-Usuarios/Lista-Usuarios.component';
import { MembresiasComponent } from './components/organims/Admin/Membresias/Membresias.component';
import { NovedadesAdminComponent } from './components/organims/Admin/Novedades/Novedades.component';
import { NoticiasComponent } from './pages/Noticias/Noticias.component';

export const routes: Routes = [
  { path: 'Login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'Lista-Usuarios', component: ListaUsuariosComponent },
  { path: 'Membresias', component: MembresiasComponent},
  { path: 'Novedades-Admin', component: NovedadesAdminComponent},
  { path: 'Noticias', component: NoticiasComponent},



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
