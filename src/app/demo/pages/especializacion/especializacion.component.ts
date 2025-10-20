import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { EspecializacionService } from './service/especializacion.service';
import { UtilService } from 'src/app/services/common/util.service';
import { Especializacion } from './model/especializacion';

@Component({
  selector: 'app-especializacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.scss']
})
export class EspecializacionComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion = new Especializacion();
  titleSpinner: string = "Cargando Especializaciones...";
  especializacionList: Especializacion[] = [];

  /** 🔍 Listado filtrado y variable del campo de búsqueda */
  especializacionFiltrado: Especializacion[] = [];
  filtroPaciente: string = '';
  codigoEspecializacionFiltro: string = '';

  /** 🔽 Variables de ordenamiento */
  criterioOrden: string = '';
  direccionOrden: 'asc' | 'desc' = 'asc';

  form: FormGroup = new FormGroup({
    Id: new FormControl(null),
    codigoEspecializacion: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
  });

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly utilService: UtilService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
  ) {
    this.inicializarFormulario();
    this.listarEspecializaciones();
    this.mostrarSpinnerTemporal();
  }

  mostrarSpinnerTemporal(): void {
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 2000);
  }

  inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      Id: [null], // ✅ Quitado Validators.required para permitir creación
      codigoEspecializacion: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  listarEspecializaciones(): void {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacionList = data || [];
        this.filtrarEspecializaciones(); // ✅ Mantiene la lista filtrada actualizada
      },
      error: (error) => {
        console.error('Error al obtener especializaciones:', error);
        Swal.fire('Error', 'No se pudieron cargar las especializaciones', 'error');
      }
    });
  }

  /** 🔍 Filtrado de pacientes */
  filtrarEspecializaciones(): void {
    const filtro = this.filtroPaciente.toLowerCase().trim();

    if (!filtro && !this.codigoEspecializacionFiltro) {
      this.especializacionFiltrado = [...this.especializacionList];
      return;
    }

    this.especializacionFiltrado = this.especializacionList.filter(p => {
      const nombre = (p.nombre || '').toLowerCase();
      const codigoEspecializacion = (p.codigoEspecializacion || '').toLowerCase();
      const descripcion = (p.descripcion || '').toLowerCase();
      const matchTexto = (
        nombre.includes(filtro) ||
        descripcion.includes(filtro) ||
        codigoEspecializacion.includes(filtro)
      );
      return matchTexto;
    });
  }

  /** 🔽 Ordenar tabla por columna */
  ordenarPor(campo: keyof Especializacion | 'Id'): void {
    if (this.criterioOrden === campo) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.criterioOrden = campo;
      this.direccionOrden = 'asc';
    }

    this.especializacionFiltrado.sort((a: any, b: any) => {
      const valorA = (a[campo] ?? '').toString().toLowerCase();
      const valorB = (b[campo] ?? '').toString().toLowerCase();

      if (valorA < valorB) return this.direccionOrden === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  openModal(modo: string): void {
    this.titleModal = modo === 'C' ? 'Crear Especialización' : 'Editar Especialización';
    this.titleBoton = modo === 'C' ? 'Guardar Especialización' : 'Actualizar Especialización';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaExpecializacion(): void {
    this.especializacionSelected = new Especializacion();
    this.form.reset({
      Id: null,
      codigoEspecializacion: '',
      nombre: '',
      descripcion: ''
    });
    this.openModal('C');
  }

  abrirEditarExpecializacion(especializacion: Especializacion): void {
    this.especializacionSelected = especializacion;
    const Id = (especializacion as any)?.Id ?? null;
    const nombre = (especializacion as any)?.nombre ?? '';
    const codigoEspecializacion = (especializacion as any)?.codigoEspecializacion ?? '';
    const descripcion = (especializacion as any)?.descripcion ?? '';
    this.form.patchValue({ Id, nombre, codigoEspecializacion, descripcion });
    this.openModal('E');
  }

  guardarEspecializacion(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    const especializacionData = this.form.getRawValue();

    const titulo = this.modoFormulario === 'C' ? 'Crear especialización' : 'Actualizar especialización';
    const texto = this.modoFormulario === 'C'
      ? '¿Desea crear esta especialización?'
      : '¿Desea actualizar los datos de esta especialización?';

    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.modoFormulario === 'C' ? 'Sí, crear' : 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        if (this.modoFormulario === 'C') {
          this.crearEspecializacion(especializacionData);
        } else {
          this.actualizarEspecializacionBackend({ ...this.especializacionSelected, ...especializacionData });
        }
      }
    });
  }

  confirmarEliminarEspecializacion(especializacion: Especializacion): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la especialización ${especializacion.nombre} (${especializacion.codigoEspecializacion})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eliminarEspecializacion(especializacion);
      }
    });
  }

  private eliminarEspecializacion(especializacion: Especializacion): void {
    this.especializacionService.eliminarEspecializaciones(especializacion).subscribe({
      next: (resp) => {
        Swal.fire('Eliminado', resp.message || 'Especialización eliminada correctamente.', 'success');
        this.listarEspecializaciones();
      },
      error: (err) => {
        console.error('Error al eliminar especialización:', err);
        Swal.fire('Error', err?.error?.message || 'No se pudo eliminar la especialización.', 'error');
      }
    });
  }

  private crearEspecializacion(especializacionData: any): void {
    this.especializacionService.guardarEspecializaciones(especializacionData).subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.message || 'Especialización creada correctamente.', 'success');
        this.listarEspecializaciones();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear especialización:', error);
        Swal.fire('Error', error?.error?.message || 'Error al crear la especialización.', 'error');
      }
    });
  }

  private actualizarEspecializacionBackend(especializacionActualizado: Especializacion): void {
    this.especializacionService.actualizarEspecializaciones(especializacionActualizado).subscribe({
      next: (data) => {
        Swal.fire('Éxito', data.message || 'Especialización actualizada correctamente.', 'success');
        this.listarEspecializaciones();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar especialización:', error);
        Swal.fire('Error', error?.error?.message || 'Error al actualizar la especialización.', 'error');
      }
    });
  }
}