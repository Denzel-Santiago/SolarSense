import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    // Inicializar el botón de Google una vez que el DOM esté listo
    window.google?.accounts.id.initialize({
      client_id: 'TU_CLIENT_ID_DE_GOOGLE', // 🔁 Reemplaza esto
      callback: (response: any) => this.handleGoogleLogin(response)
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("googleLogin")!,
      { theme: "outline", size: "large" }
    );
  }

  onLogin() {
    this.http.post<any>('http://3.223.148.111:8000/api/auth/email/login', {
      email: this.loginData.email,
      password: this.loginData.password
    }).subscribe({
      next: res => {
        alert("✅ Inicio de sesión exitoso");
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1500);
      },
      error: err => {
        alert(`❌ Error: ${err.error?.error || 'Error desconocido'}`);
      }
    });
  }

  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    this.http.post<any>('http://3.223.148.111:8000/api/auth/email/register', {
      email: this.registerData.email,
      password: this.registerData.password,
      username: this.registerData.username
    }).subscribe({
      next: res => {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      },
      error: err => {
        alert(`❌ Error: ${err.error?.error || 'Error desconocido'}`);
      }
    });
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;

    this.http.post<any>('http://3.223.148.111:8000/api/auth/google', {
      idToken
    }).subscribe({
      next: res => {
        alert("✅ Autenticación con Google exitosa");
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1500);
      },
      error: err => {
        alert(`❌ Error: ${err.error?.error || 'Error desconocido'}`);
      }
    });
  }
}
