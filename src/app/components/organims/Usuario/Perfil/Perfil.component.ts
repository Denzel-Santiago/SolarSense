// Perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { AuthService } from '../../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, FormsModule, SideNavComponent, NgFor, DatePipe],
  templateUrl: './Perfil.component.html',
})
export class PerfilComponent implements OnInit {
  usuario = {
    id: 0,
    nombre: '',
    usuario: '',
    displayName: '',
    correo: '',
    imagen: '',
    auth_type: '',
    last_login: '',
    created_at: '',
    is_active: false,
    provider: '',
    uid: ''
  };

  raspberries = [
    { nombre: 'EVA 001', icono: 'assets/rass.png' }
  ];

  modalAbierto = false;
  usuarioTemporal = { 
    nombre: '', 
    usuario: '', 
    displayName: '',
    correo: '', 
    imagen: '' 
  };
  imagenPreview: string = '';
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.errorMessage = 'No se pudo obtener la información del usuario';
      this.isLoading = false;
      return;
    }

    console.log('Current user data:', currentUser);

    // Verificar si es un usuario de Google
    const isGoogleUser = currentUser.user?.auth_type === 'google' || 
                        currentUser.auth_type === 'google' ||
                        currentUser.user?.provider === 'google' ||
                        currentUser.provider === 'google';

    if (isGoogleUser) {
      // Para usuarios de Google, usar el UID
      let googleUid: string;
      
      // Buscar el UID en diferentes ubicaciones posibles
      if (currentUser.user?.uid) {
        googleUid = currentUser.user.uid;
      } else if (currentUser.uid) {
        googleUid = currentUser.uid;
      } else if (currentUser.user?.id && typeof currentUser.user.id === 'string') {
        googleUid = currentUser.user.id;
      } else if (currentUser.id && typeof currentUser.id === 'string') {
        googleUid = currentUser.id;
      } else {
        this.errorMessage = 'No se pudo obtener el UID de Google del usuario';
        this.isLoading = false;
        return;
      }

      console.log('Usuario de Google detectado, usando UID:', googleUid);
      this.obtenerDatosUsuarioGoogle(googleUid);
      
    } else {
      // Para usuarios regulares (email/password), usar ID numérico
      let userId: number;
      
      if (currentUser.user && typeof currentUser.user.id === 'number') {
        userId = currentUser.user.id;
      } else if (typeof currentUser.id === 'number') {
        userId = currentUser.id;
      } else if (typeof currentUser.id === 'string' && !isNaN(Number(currentUser.id))) {
        userId = Number(currentUser.id);
      } else {
        this.errorMessage = 'No se pudo obtener el ID interno del usuario';
        this.isLoading = false;
        return;
      }

      console.log('Usuario regular detectado, usando ID interno:', userId);
      this.obtenerDatosUsuarioRegular(userId);
    }
  }

  private obtenerDatosUsuarioGoogle(uid: string) {
    console.log('Obteniendo datos de usuario de Google con UID:', uid);
    
    this.http.get(`http://3.223.148.111:8000/api/auth/google/users/${uid}`)
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor (Google):', response);
          
          if (response.success && response.user) {
            const userData = response.user;
            this.usuario = {
              id: userData.id,
              nombre: userData.display_name || userData.username || 'Usuario de Google',
              usuario: userData.username || userData.display_name || 'N/A',
              displayName: userData.display_name || 'N/A',
              correo: userData.email,
              imagen: userData.photo_url || '',
              auth_type: userData.auth_type,
              last_login: userData.last_login,
              created_at: userData.created_at,
              is_active: userData.is_active,
              provider: userData.provider,
              uid: userData.uid
            };
            
            console.log('Datos del usuario Google cargados:', this.usuario);
          } else {
            this.errorMessage = 'No se encontraron datos del usuario de Google';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuario de Google:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'Usuario de Google no encontrado en el servidor';
          } else if (error.status === 401) {
            this.errorMessage = 'No autorizado para acceder a los datos del usuario';
          } else {
            this.errorMessage = 'Error al cargar los datos del usuario de Google';
          }
          
          this.isLoading = false;
        }
      });
  }

  private obtenerDatosUsuarioRegular(userId: number) {
    console.log('Obteniendo datos de usuario regular con ID:', userId);
    
    this.http.get(`http://3.223.148.111:8000/api/auth/public/users/${userId}`)
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor (Regular):', response);
          
          if (response.success && response.user) {
            const userData = response.user;
            this.usuario = {
              id: userData.id,
              nombre: userData.display_name || userData.username,
              usuario: userData.username,
              displayName: userData.display_name,
              correo: userData.email,
              imagen: userData.photo_url || '',
              auth_type: userData.auth_type,
              last_login: userData.last_login,
              created_at: userData.created_at,
              is_active: userData.is_active,
              provider: userData.provider || 'email',
              uid: ''
            };
            
            console.log('Datos del usuario regular cargados:', this.usuario);
          } else {
            this.errorMessage = 'No se encontraron datos del usuario';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuario regular:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'Usuario no encontrado en el servidor';
          } else if (error.status === 401) {
            this.errorMessage = 'No autorizado para acceder a los datos del usuario';
          } else {
            this.errorMessage = 'Error al cargar los datos del usuario';
          }
          
          this.isLoading = false;
        }
      });
  }

  abrirModal() {
    // Solo permitir edición para usuarios que no son de Google
    if (this.usuario.auth_type === 'google') {
      return;
    }

    this.usuarioTemporal = { 
      nombre: this.usuario.nombre, 
      usuario: this.usuario.usuario,
      displayName: this.usuario.displayName,
      correo: this.usuario.correo, 
      imagen: this.usuario.imagen 
    };
    this.imagenPreview = this.usuario.imagen;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarCambios() {
    // Solo para usuarios que no son de Google
    if (this.usuario.auth_type === 'google') {
      this.errorMessage = 'Los usuarios de Google no pueden editar su perfil desde aquí';
      return;
    }

    this.isLoading = true;
    const userId = this.usuario.id;
    
    if (!userId) {
      this.errorMessage = 'No se pudo obtener el ID del usuario';
      this.isLoading = false;
      return;
    }

    const datosActualizados = {
      username: this.usuarioTemporal.usuario,
      display_name: this.usuarioTemporal.nombre,
      email: this.usuarioTemporal.correo,
      photo_url: this.imagenPreview
    };

    // Usar el endpoint apropiado según el tipo de usuario
    const updateUrl = `http://3.223.148.111:8000/api/auth/public/users/${userId}/update`;

    this.http.put(updateUrl, datosActualizados)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.usuario = { 
              ...this.usuario,
              nombre: this.usuarioTemporal.nombre,
              displayName: this.usuarioTemporal.nombre,
              usuario: this.usuarioTemporal.usuario,
              correo: this.usuarioTemporal.correo,
              imagen: this.imagenPreview
            };
          }
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.errorMessage = 'Error al guardar los cambios';
          this.isLoading = false;
        }
      });
  }

  subirImagen(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  }
}