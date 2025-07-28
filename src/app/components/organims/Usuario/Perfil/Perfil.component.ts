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
    provider: ''
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

    // Obtener el ID interno de la BD
    let userId: number;
    
    // Priorizar el ID del objeto user si existe y es numérico
    if (currentUser.user && typeof currentUser.user.id === 'number') {
      userId = currentUser.user.id;
    } 
    // Si no, usar el ID directo si es numérico
    else if (typeof currentUser.id === 'number') {
      userId = currentUser.id;
    }
    // Si el ID es string, intentar convertirlo
    else if (typeof currentUser.id === 'string' && !isNaN(Number(currentUser.id))) {
      userId = Number(currentUser.id);
    }
    // Para usuarios de Google que aún no tienen ID interno, necesitamos buscarlo
    else if (currentUser.needsInternalId || (typeof currentUser.id === 'string' && currentUser.user?.auth_type === 'google')) {
      console.log('Usuario de Google sin ID interno, intentando obtener datos del servidor...');
      this.buscarUsuarioGoogle(currentUser);
      return;
    }
    else {
      this.errorMessage = 'No se pudo obtener el ID interno del usuario';
      this.isLoading = false;
      return;
    }

    console.log('Usando ID interno para petición:', userId);
    this.obtenerDatosUsuario(userId);
  }

  private buscarUsuarioGoogle(currentUser: any) {
    // Para usuarios de Google, intentaremos con algunos IDs posibles
    // Si el backend devuelve el ID correcto durante el login, esto no debería ser necesario
    
    // Primero, intentar con el email para hacer una petición que nos pueda dar pistas
    // o simplemente mostrar un error más específico
    
    console.log('Intentando obtener datos de usuario de Google...');
    console.log('Email del usuario:', currentUser.email);
    
    // Como no tenemos un endpoint directo por email, 
    // mostraremos un mensaje más específico
    this.errorMessage = `No se pudo obtener el ID interno del usuario de Google. 
                        Email: ${currentUser.email}. 
                        Es posible que el backend necesite devolver más información durante el login con Google.`;
    this.isLoading = false;
  }

  private obtenerDatosUsuario(userId: number) {
    this.http.get(`http://3.223.148.111:8000/api/auth/public/users/${userId}`)
      .subscribe({
        next: (response: any) => {
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
              provider: userData.provider
            };
            
            console.log('Datos del usuario cargados:', this.usuario);
          } else {
            this.errorMessage = 'No se encontraron datos del usuario';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          this.errorMessage = 'Error al cargar los datos del usuario';
          this.isLoading = false;
        }
      });
  }

  abrirModal() {
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

    this.http.put(`http://3.223.148.111:8000/api/auth/public/users/${userId}/update`, datosActualizados)
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