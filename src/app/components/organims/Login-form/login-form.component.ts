//login-form.component.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RouterLink, RouterLinkActive } from '@angular/router';

declare global {
  interface Window {
    google: any;
  }
}

interface GooglePromptNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLinkActive, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class loginFormComponent implements AfterViewInit, OnDestroy {
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

  menuAbierto = false;
  googleInitialized = false; // Cambiado a público para uso en template
  private googleScriptLoaded = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.checkGoogleAndInitialize();
  }

  ngOnDestroy(): void {
    if (window.google?.accounts?.id?.cancel) {
      window.google.accounts.id.cancel();
    }
  }

  private checkGoogleAndInitialize() {
    if (window.google?.accounts?.id) {
      this.initializeGoogleLogin();
      this.googleScriptLoaded = true;
      this.googleInitialized = true;
    } else {
      this.loadGoogleScript(() => {
        this.googleScriptLoaded = true;
        this.initializeGoogleLogin();
      });
    }
  }

  private loadGoogleScript(callback: () => void) {
    if (window.google?.accounts?.id) {
      callback();
      return;
    }

    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          callback();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    script.onerror = () => {
      console.error('Error al cargar el script de Google');
      setTimeout(() => this.loadGoogleScript(callback), 1000);
    };
    document.head.appendChild(script);
  }

  private initializeGoogleLogin() {
    try {
      if (!window.google?.accounts?.id) {
        console.warn('Google API no está disponible aún');
        setTimeout(() => this.initializeGoogleLogin(), 500);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: '661193722643-3hgg12o628opmlgo4suq0bk707195qnc.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleLogin(response),
        context: 'use',
        ux_mode: 'popup'
      });

      const buttonDiv = document.getElementById('googleLogin');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '320'
        });
      }

      this.googleInitialized = true;
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      setTimeout(() => this.initializeGoogleLogin(), 1000);
    }
  }

  onGoogleClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.googleInitialized) {
      console.warn('Google Auth no está inicializado aún');
      Swal.fire({
        icon: 'warning',
        title: 'Espere un momento',
        text: 'El servicio de Google aún se está cargando',
        timer: 1500
      });
      return;
    }

    try {
      window.google.accounts.id.prompt((notification: GooglePromptNotification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          window.google.accounts.id.prompt();
        }
      });
    } catch (error) {
      console.error('Error showing Google prompt:', error);
      this.showGoogleFallback();
    }
  }

  private showGoogleFallback() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=661193722643-3hgg12o628opmlgo4suq0bk707195qnc.apps.googleusercontent.com&` +
      `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=online`;
    
    window.location.href = authUrl;
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
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios'
        });
        return;
    }
      // Validación de contraseñas coincidentes
    if (this.registerData.password !== this.registerData.confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden'
        });
        return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un email válido'
        });
        return;
    }

    // Validación de longitud de contraseña
    if (this.registerData.password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 8 caracteres'
        });
        return;
    }

    // Preparar los datos para el backend
    const registrationData = {
        email: this.registerData.email,
        password: this.registerData.password,
        username: this.registerData.username
    };


this.http.post<any>('http://3.223.148.111:8000/api/auth/email/register', registrationData)
        .subscribe({
            next: res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'Ahora puedes iniciar sesión',
                    showConfirmButton: false,
                    timer: 2000
                });
                // Resetear el formulario después de registro exitoso
                this.registerData = {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                };
            },
            error: err => {
                let errorMessage = 'Error desconocido';
                if (err.error?.error) {
                    errorMessage = err.error.error;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el registro',
                    text: errorMessage
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