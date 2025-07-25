// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

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
import { NovedadesAdminComponent } from './components/organims/Admin/Novedades/NovedadesAdmin.component';
import { NoticiasComponent } from './pages/Noticias/Noticias.component';

export const routes: Routes = [
  { 
    path: 'Login', 
    component: LoginComponent,
    data: { requiresAuth: false }
  },
  { 
    path: '', 
    component: HomeComponent,
    data: { requiresAuth: false }
  },
  { 
    path: 'Noticias', 
    component: NoticiasComponent,
    data: { requiresAuth: false }
  },
  // Rutas de administrador
  { 
    path: 'Lista-Usuarios', 
    component: ListaUsuariosComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'Membresias', 
    component: MembresiasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'Novedades-Admin', 
    component: NovedadesAdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  // Rutas de usuarios (free y premium)
  {
    path: 'Sensores',
    component: SensoresComponent,
    canActivate: [AuthGuard],
    data: { roles: ['free', 'premium'] },
    children: [
      { path: 'UsuarioDash', component: UsuarioDashComponent },
      { path: 'Voltaje', component: VoltajeComponent },
      { path: 'Humedad', component: HumedadComponent },
      { path: 'Temperatura', component: TemperaturaComponent },
      { path: 'PresionAtmosferica', component: PresionAtmosfericaComponent },
      { path: 'Novedades', component: NovedadesComponent },
      { path: 'Perfil', component: PerfilComponent },
      // Cambiar la redirección por defecto a Novedades
      { path: '', redirectTo: 'Novedades', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];