//login.component.ts
import { Component } from '@angular/core';
import { loginFormComponent } from '../../components/organims/Login-form/login-form.component';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [loginFormComponent]
})
export class LoginComponent {}

