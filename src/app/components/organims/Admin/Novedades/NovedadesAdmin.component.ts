// novedades.component.ts
import { Component, OnInit } from '@angular/core';
import { NovedadesService } from '../../../../services/Novedades.service';
import { Novedad } from '../../../../Interface/Novedad';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { SideNavAdminComponent } from '../sidenavAdmin/sidenavAdmin.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-novedades-Admin',
  templateUrl: './NovedadesAdmin.component.html',
  standalone: true,
  imports: [SideNavAdminComponent, NgFor,DatePipe,FormsModule,NgIf]
})
export class NovedadesAdminComponent implements OnInit {
  novedades: Novedad[] = [];
  modalAbierto: boolean = false;
  esNuevaNovedad: boolean = true;
  filtroFecha: string = 'recientes';
  novedadesOriginal: Novedad[] = []; 


  constructor(private novedadesService: NovedadesService) {}

  novedadSeleccionada: Partial<Novedad> = {
  title: '',
  content: '',
  author_id: 1
};

onFiltroFechaChange() {
  this.aplicarFiltro();
}


  ngOnInit(): void {
    this.cargarNovedades();
    
  }

  cargarNovedades() {
  this.novedadesService.getAll().subscribe({
    next: (res) => {
      this.novedadesOriginal = res;
      this.aplicarFiltro();  // Mostrar por defecto los más recientes
    },
    error: (err) => alert('❌ Error al cargar novedades: ' + err.message)
  });
}

//filtro de fechas
aplicarFiltro() {
  if (!Array.isArray(this.novedadesOriginal)) {
    console.warn('❗ novedadesOriginal no está lista todavía');
    return;
  }

  const copia = [...this.novedadesOriginal];

  this.novedades = copia.sort((a, b) => {
    const fechaA = new Date(a.created_at).getTime();
    const fechaB = new Date(b.created_at).getTime();

    return this.filtroFecha === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
  });
}




  // Abrir modal para nueva novedad
abrirModalNueva() {
  this.esNuevaNovedad = true;
  this.novedadSeleccionada = { title: '', content: '', author_id: 1 };
  this.modalAbierto = true;
}

// Abrir modal para editar
editar(index: number) {
  const novedad = this.novedades[index];
  this.novedadSeleccionada = { ...novedad }; // clonar para evitar edición directa
  this.esNuevaNovedad = false;
  this.modalAbierto = true;
}

// Cerrar modal
cerrarModal() {
  this.modalAbierto = false;
}

// Guardar cambios (crear o editar)
guardarCambios() {
  if (!this.novedadSeleccionada.title || !this.novedadSeleccionada.content) {
    Swal.fire('Campos requeridos', 'Todos los campos son obligatorios.', 'warning');
    return;
  }

  if (this.esNuevaNovedad) {
    this.novedadesService.create(this.novedadSeleccionada as any).subscribe({
      next: () => {
        Swal.fire('¡Agregado!', 'La novedad fue registrada.', 'success');
        this.cerrarModal();
        this.cargarNovedades();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo agregar la novedad.', 'error');
        console.error(err);
      }
    });
  } else {
    this.novedadesService.update(this.novedadSeleccionada.id!, this.novedadSeleccionada).subscribe({
      next: () => {
        Swal.fire('¡Editado!', 'La novedad fue actualizada.', 'success');
        this.cerrarModal();
        this.cargarNovedades();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar la novedad.', 'error');
        console.error(err);
      }
    });
  }
}

 eliminar(index: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta novedad se eliminará permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Aquí va tu lógica para eliminar
      this.novedades.splice(index, 1); // o llama a tu servicio de eliminación

      Swal.fire({
        title: '¡Eliminado!',
        text: 'La novedad ha sido eliminada.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

}