import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class loginFormComponent implements AfterViewInit {
  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.loadGoogleScript(() => {
      this.initializeGoogleLogin();
    });
  }

  preventFlip(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }

  private loadGoogleScript(callback: () => void) {
    if (window.google?.accounts?.id) {
      callback();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  private initializeGoogleLogin() {
    try {
      window.google.accounts.id.initialize({
        client_id: '661193722643-3hgg12o628opmlgo4suq0bk707195qnc.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleLogin(response),
        ux_mode: 'popup',
        context: 'use',
        hosted_domain: 'localhost',
        redirect_uri: 'http://localhost:4200'
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLogin"),
        {
          theme: "outline",
          size: "large",
          text: "continue_with",
          width: "300"
        }
      );

      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
    }
  }

  onLogin() {
    this.http.post<any>('http://3.223.148.111:8000/api/auth/email/login', {
      email: this.loginData.email,
      password: this.loginData.password
    }).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.href = '/Sensores';
        }, 1500);
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.error || 'Error desconocido'
        });
      }
    });
  }

  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    this.http.post<any>('http://3.223.148.111:8000/api/auth/email/register', {
      email: this.registerData.email,
      password: this.registerData.password,
      username: this.registerData.username
    }).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: err.error?.error || 'Error desconocido'
        });
      }
    });
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;

    this.http.post<any>('http://3.223.148.111:8000/api/auth/google', {
      idToken
    }).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Inicio con Google exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.href = '/Sensores';
        }, 1500);
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error con Google',
          text: err.error?.error || 'Error desconocido'
        });
      }
    });
  }
}
