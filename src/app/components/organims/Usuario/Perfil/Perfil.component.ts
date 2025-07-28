// Perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { SideNavComponent } from '../../sidenav/sidenav.component';
import { AuthService } from '../../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
    // Permitir edición para ambos tipos de usuarios ahora
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
    this.errorMessage = ''; // Limpiar errores al cerrar
  }

  guardarCambios() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const currentUser = this.authService.currentUserValue;
    const isGoogleUser = this.usuario.auth_type === 'google';
    
    console.log('Guardando cambios para usuario:', isGoogleUser ? 'Google' : 'Email');
    console.log('Datos temporales:', this.usuarioTemporal);
    
    if (isGoogleUser) {
      // NUEVA LÓGICA PARA USUARIOS DE GOOGLE
      // Usar el endpoint específico con email en la URL
      const updateData = {
        display_name: this.usuarioTemporal.nombre
      };
      
      const googleEmail = this.usuario.correo;
      const updateUrl = `http://3.223.148.111:8000/api/auth/user/actualizar/google/${googleEmail}`;
      
      console.log('Enviando datos de actualización para Google:', updateData);
      console.log('URL de actualización:', updateUrl);
      
      this.http.put(updateUrl, updateData)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta de actualización Google:', response);
            
            if (response.success) {
              // Actualizar los datos locales
              this.usuario = { 
                ...this.usuario,
                nombre: this.usuarioTemporal.nombre,
                displayName: this.usuarioTemporal.nombre
              };
              
              // Mostrar mensaje de éxito
              Swal.fire({
                title: '¡Éxito!',
                text: 'Perfil de Google actualizado correctamente',
                icon: 'success',
                confirmButtonColor: '#16a34a'
              });
              
              this.cerrarModal();
            } else {
              this.errorMessage = response.message || 'Error desconocido al actualizar';
            }
            
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al actualizar usuario de Google:', error);
            this.isLoading = false;
            
            // Manejar errores específicos
            if (error.status === 404) {
              this.errorMessage = 'Usuario de Google no encontrado';
            } else if (error.status === 401) {
              this.errorMessage = 'No autorizado para realizar esta acción';
            } else if (error.status === 400) {
              this.errorMessage = 'Datos inválidos proporcionados';
            } else {
              this.errorMessage = 'Error al guardar los cambios de Google. Intente nuevamente.';
            }
            
            // Mostrar error con SweetAlert
            Swal.fire({
              title: 'Error',
              text: this.errorMessage,
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        });
        
    } else {
      // LÓGICA EXISTENTE PARA USUARIOS DE EMAIL
      const fieldsToUpdate: any = {
        user_id: this.usuario.id,
        auth_type: 'email'
      };
      
      // Solo incluir campos que realmente han cambiado
      if (this.usuarioTemporal.correo !== this.usuario.correo) {
        fieldsToUpdate.email = this.usuarioTemporal.correo;
      }
      
      if (this.usuarioTemporal.usuario !== this.usuario.usuario) {
        fieldsToUpdate.username = this.usuarioTemporal.usuario;
      }
      
      if (this.usuarioTemporal.nombre !== this.usuario.nombre) {
        fieldsToUpdate.display_name = this.usuarioTemporal.nombre;
      }

      console.log('Enviando datos de actualización para Email:', fieldsToUpdate);

      // Usar el endpoint unificado para usuarios de email
      this.http.put('http://3.223.148.111:8000/api/auth/user/actualizar', fieldsToUpdate)
        .subscribe({
          next: (response: any) => {
            console.log('Respuesta de actualización Email:', response);
            
            if (response.success) {
              // Actualizar los datos locales
              this.usuario = { 
                ...this.usuario,
                nombre: this.usuarioTemporal.nombre,
                displayName: this.usuarioTemporal.nombre,
                usuario: this.usuarioTemporal.usuario,
                correo: this.usuarioTemporal.correo,
                imagen: this.imagenPreview
              };
              
              // Mostrar mensaje de éxito
              Swal.fire({
                title: '¡Éxito!',
                text: 'Perfil actualizado correctamente',
                icon: 'success',
                confirmButtonColor: '#16a34a'
              });
              
              this.cerrarModal();
            } else {
              this.errorMessage = response.message || 'Error desconocido al actualizar';
            }
            
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al actualizar usuario de email:', error);
            this.isLoading = false;
            
            // Manejar errores específicos basados en la respuesta del backend
            if (error.error?.type === 'validation_error') {
              switch (error.error.error) {
                case 'at least one field must be provided for email users (email, username or display_name)':
                  this.errorMessage = 'Debe proporcionar al menos un campo para actualizar (email, usuario o nombre)';
                  break;
                case 'display_name is required for google users':
                  this.errorMessage = 'El nombre es requerido para usuarios de Google';
                  break;
                case 'invalid auth_type':
                  this.errorMessage = 'Tipo de autenticación inválido';
                  break;
                case 'email already in use':
                  this.errorMessage = 'El email ya está en uso por otro usuario';
                  break;
                case 'user not found: sql: no rows in result set':
                  this.errorMessage = 'Usuario no encontrado';
                  break;
                default:
                  this.errorMessage = error.error.error || 'Error de validación';
              }
            } else if (error.status === 404) {
              this.errorMessage = 'Usuario no encontrado';
            } else if (error.status === 401) {
              this.errorMessage = 'No autorizado para realizar esta acción';
            } else if (error.status === 400) {
              this.errorMessage = 'Datos inválidos proporcionados';
            } else {
              this.errorMessage = 'Error al guardar los cambios. Intente nuevamente.';
            }
            
            // Mostrar error con SweetAlert
            Swal.fire({
              title: 'Error',
              text: this.errorMessage,
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        });
    }
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