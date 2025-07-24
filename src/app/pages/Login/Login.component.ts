//login.component.ts
import { Component } from '@angular/core';
import { loginFormComponent } from '../../components/organims/Login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './Login.component.html',
  imports: [loginFormComponent]
})
export class LoginComponent {}

