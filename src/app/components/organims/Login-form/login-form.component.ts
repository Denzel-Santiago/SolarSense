// src/app/pages/Login/login-form.component.ts
import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

declare global {
  interface Window {
    google: any;
  }
}

interface GooglePromptNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  getDismissedReason(): string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLinkActive, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class loginFormComponent implements OnInit, AfterViewInit, OnDestroy {
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
  googleInitialized = false;
  private googleScriptLoaded = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir inmediatamente
    if (this.authService.isLoggedIn()) {
      console.log('User already logged in, redirecting...');
      this.redirectBasedOnRole();
      return;
    }
  }

  ngAfterViewInit(): void {
    // Solo inicializar Google si no está logueado
    if (!this.authService.isLoggedIn()) {
      this.initializeGoogleAuth();
    }
  }

  ngOnDestroy(): void {
    if (window.google?.accounts?.id?.cancel) {
      window.google.accounts.id.cancel();
    }
  }

  private initializeGoogleAuth(): void {
    if (window.google?.accounts?.id) {
      this.setupGoogleAuth();
    } else {
      this.loadGoogleScript().then(() => {
        this.setupGoogleAuth();
      }).catch(error => {
        console.error('Failed to load Google script:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el servicio de Google. Por favor recarga la página.',
          timer: 3000,
          showConfirmButton: false
        });
      });
    }
  }

  private loadGoogleScript(): Promise<void> {
    if (this.googleScriptLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Verificar si ya existe el script
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        const checkInterval = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(checkInterval);
            this.googleScriptLoaded = true;
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.googleScriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google script'));
      };
      document.head.appendChild(script);
    });
  }

  private setupGoogleAuth(): void {
    try {
      if (!window.google?.accounts?.id) {
        console.warn('Google API no está disponible aún');
        setTimeout(() => this.setupGoogleAuth(), 500);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: '661193722643-3hgg12o628opmlgo4suq0bk707195qnc.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleLogin(response),
        context: 'signin',
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true
      });

      const buttonDiv = document.getElementById('googleLogin');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '320'
        });
      }

      this.googleInitialized = true;
      console.log('Google Auth initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      setTimeout(() => this.setupGoogleAuth(), 1000);
    }
  }

  onGoogleClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Google click event triggered');
    
    if (!this.googleInitialized) {
      console.warn('Google Auth no está inicializado aún');
      Swal.fire({
        icon: 'warning',
        title: 'Espere un momento',
        text: 'El servicio de Google aún se está cargando',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    try {
      // Forzar el prompt de Google
      window.google.accounts.id.prompt((notification: GooglePromptNotification) => {
        console.log('Google prompt notification:', notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google prompt not displayed, trying fallback');
          this.showGoogleFallback();
        }
      });
    } catch (error) {
      console.error('Error showing Google prompt:', error);
      this.showGoogleFallback();
    }
  }

  private showGoogleFallback(): void {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=661193722643-3hgg12o628opmlgo4suq0bk707195qnc.apps.googleusercontent.com&` +
      `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=online`;
    
    console.log('Redirecting to Google OAuth URL:', authUrl);
    window.location.href = authUrl;
  }

  onLogin(): void {
    // Validaciones básicas
    if (!this.loginData.email || !this.loginData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    console.log('Attempting login with email:', this.loginData.email);

    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.redirectBasedOnRole();
          });
        },
        error: err => {
          console.error('Login error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.error || err.error?.message || 'Error al iniciar sesión',
            timer: 3000,
            showConfirmButton: false
          });
        }
      });
  }

  onRegister(event: Event): void {
    event.preventDefault();

    const { username, email, password, confirmPassword } = this.registerData;

    if (!username || !email || !password || !confirmPassword) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire('Error', 'Por favor ingresa un email válido', 'error');
      return;
    }

    if (password.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    this.authService.register(username, email, password)
      .subscribe({
        next: () => {
          Swal.fire('Registro exitoso', 'Ahora puedes iniciar sesión', 'success');
          this.registerData = { username: '', email: '', password: '', confirmPassword: '' };
        },
        error: err => {
          const msg = err.error?.error || err.error?.message || err.message || 'Error desconocido';
          Swal.fire('Error en el registro', msg, 'error');
        }
      });
  }

  handleGoogleLogin(response: any): void {
    console.log('Google login response received:', response);
    
    if (!response?.credential) {
      console.error('No credential received from Google');
      Swal.fire({
        icon: 'error',
        title: 'Error con Google',
        text: 'No se recibió credencial de Google',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    const idToken = response.credential;
    console.log('Sending Google token to backend...');
    
    this.authService.loginWithGoogle(idToken)
      .subscribe({
        next: () => {
          console.log('Google login successful');
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.redirectBasedOnRole();
          });
        },
        error: err => {
          console.error('Google login error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error con Google',
            text: err.error?.message || 'Error al iniciar sesión con Google',
            timer: 3000,
            showConfirmButton: false
          });
        }
      });
  }

  private redirectBasedOnRole(): void {
    console.log('Redirecting based on role...');
    console.log('Is admin:', this.authService.isAdmin());
    console.log('Current user:', this.authService.currentUserValue);
    
    if (this.authService.isAdmin()) {
      console.log('Redirecting to admin dashboard');
      this.router.navigate(['/Lista-Usuarios']);
    } else {
      console.log('Redirecting to user dashboard');
      this.router.navigate(['/Sensores/Novedades']);
    }
  }
}