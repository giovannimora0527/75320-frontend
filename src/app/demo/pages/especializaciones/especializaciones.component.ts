import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EspecializacionService } from './service/especializaciones.service';
import { Especializacion } from './models/especializacion';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-especializacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './especializaciones.component.html',
  styleUrls: ['./especializaciones.component.scss']
})
export class EspecializacionComponent implements OnInit {
  especializaciones: Especializacion[] = [];
  especializacionForm!: FormGroup;
  modalInstance: any;
  isLoading = false;
  isEditing = false;
  especializacionSeleccionada: Especializacion | null = null;

  constructor(
    private svc: EspecializacionService,
    private fb: FormBuilder
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarEspecializaciones();
  }

  inicializarFormulario(): void {
    this.especializacionForm = this.fb.group({
      id: [null],
      codigoEspecializacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  cargarEspecializaciones(): void {
    this.isLoading = true;
    this.svc.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializaciones = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar especializaciones:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las especializaciones',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  abrirModal(especializacion?: Especializacion): void {
    this.isEditing = !!especializacion;

    if (especializacion) {
      this.especializacionSeleccionada = especializacion;
      this.especializacionForm.patchValue(especializacion);
    } else {
      this.especializacionSeleccionada = null;
      this.especializacionForm.reset();
    }

    const modalElement = document.getElementById('especializacionModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  cerrarModal(): void {
    this.modalInstance?.hide();
    this.especializacionForm.reset();
    this.especializacionSeleccionada = null;
    this.isEditing = false;
  }

  guardarEspecializacion(): void {
    if (this.especializacionForm.invalid) {
      Object.keys(this.especializacionForm.controls).forEach(key => {
        this.especializacionForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const especializacion: Especializacion = this.especializacionForm.value;

    const operacion = this.isEditing
      ? this.svc.actualizarEspecializacion(especializacion)
      : this.svc.crearEspecializacion(especializacion);

    operacion.subscribe({
      next: () => {
        this.isLoading = false;
        this.cerrarModal();
        this.cargarEspecializaciones();

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Especialización ${this.isEditing ? 'actualizada' : 'creada'} correctamente`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error al guardar especialización:', error);
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo ${this.isEditing ? 'actualizar' : 'crear'} la especialización`,
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  eliminarEspecializacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.svc.eliminarEspecializacion(id).subscribe({
          next: () => {
            this.isLoading = false;
            this.cargarEspecializaciones();

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Especialización eliminada correctamente',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error al eliminar especialización:', error);
            this.isLoading = false;

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la especialización',
              confirmButtonColor: '#3085d6'
            });
          }
        });
      }
    });
  }

  // Getters del formulario
  get codigoEspecializacion() { return this.especializacionForm.get('codigoEspecializacion'); }
  get nombre() { return this.especializacionForm.get('nombre'); }
  get descripcion() { return this.especializacionForm.get('descripcion'); }
}
