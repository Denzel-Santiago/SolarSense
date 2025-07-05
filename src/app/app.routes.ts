import { Routes } from '@angular/router';
import { loginFormComponent } from './components/organims/Login-form/login-form.component';
import { LoginComponent } from './pages/Login/Login.component';
import { UsuarioDashComponent } from './pages/Usuario/UsuarioDash.component';
import { VoltajeComponent } from './pages/Voltaje/Voltaje.component';
import { HumedadComponent } from './pages/Humedad/Humedad.component';
import { TemperaturaComponent } from './pages/Temperatura/Temperatura.component';
import { PresionAtmosfericaComponent } from './pages/PresionAtmosferica/PresionAtmosferica.component';






export const routes: Routes = [

    {path: '', component: LoginComponent},
    {path: 'UsuarioDash', component: UsuarioDashComponent},
    {path: 'Voltaje', component: VoltajeComponent},
    {path: 'Humedad', component: HumedadComponent},
    {path: 'Temperatura', component: TemperaturaComponent},
    {path: 'PresionAtmosferica', component: PresionAtmosfericaComponent},
    






];
