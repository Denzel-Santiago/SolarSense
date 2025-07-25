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
      this.checkGoogleAndInitialize();
    }
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
      setTimeout(() => this.initializeGoogleLogin(), 1000);
    }
  }

  onGoogleClick(event: Event) {
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

  private showGoogleFallback() {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=661193722643-3hgg12o628opmlgo4suq0bk707195qnc.apps.googleusercontent.com&` +
      `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=online`;
    
    console.log('Redirecting to Google OAuth URL:', authUrl);
    window.location.href = authUrl;
  }

  onLogin() {
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

  onRegister() {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa un email válido',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    if (this.registerData.password.length < 8) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña debe tener al menos 8 caracteres',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    this.authService.register(
      this.registerData.username,
      this.registerData.email,
      this.registerData.password
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión',
          showConfirmButton: false,
          timer: 2000
        });
        this.registerData = {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
      },
      error: err => {
        console.error('Register error:', err);
        let errorMessage = 'Error desconocido';
        if (err.error?.error) {
          errorMessage = err.error.error;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: errorMessage,
          timer: 3000,
          showConfirmButton: false
        });
      }
    });
  }

  handleGoogleLogin(response: any) {
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
        next: (response) => {
          console.log('Google login successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Inicio con Google exitoso',
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
            text: err.error?.error || err.error?.message || 'Error al iniciar sesión con Google',
            timer: 3000,
            showConfirmButton: false
          });
        }
      });
  }

  private redirectBasedOnRole() {
    console.log('Redirecting based on role...');
    console.log('Is admin:', this.authService.isAdmin());
    console.log('Current user:', this.authService.currentUserValue);
    
    if (this.authService.isAdmin()) {
      console.log('Redirecting to admin dashboard');
      this.router.navigate(['/Lista-Usuarios']);
    } else {
      console.log('Redirecting to user dashboard');
      // Para usuarios free y premium, redirigir a Novedades
      this.router.navigate(['/Sensores/Novedades']);
    }
  }
}