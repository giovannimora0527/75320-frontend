import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {
  medicamentos: Medicamento[] = [];
  isLoading = false;
  searchTerm = '';
  modoFormulario = '';
  modalInstance: Modal | null = null;
  titleModal = '';
  titleBoton = '';
  medicamentoSelected: Medicamento | null = null;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    presentacion: new FormControl(''),
    cantidad: new FormControl(''),
    fechaCompra: new FormControl(''),
    fechaVence: new FormControl('')
  });

  constructor(
    private medicamentoService: MedicamentoService,
    private formBuilder: FormBuilder
  ) {
    this.cargarFormulario();
    this.listarMedicamentos();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      presentacion: ['', [Validators.required]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    });
  }

  listarMedicamentos() {
    this.isLoading = true;
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data: any) => {
        // Manejar diferentes formatos de respuesta
        if (Array.isArray(data)) {
          this.medicamentos = data;
        } else if (Array.isArray(data?.data)) {
          this.medicamentos = data.data;
        } else if (Array.isArray(data?.content)) {
          this.medicamentos = data.content;
        } else {
          this.medicamentos = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al listar medicamentos:', err);
        this.medicamentos = [];
        this.isLoading = false;
        
        let mensajeError = 'No se pudieron cargar los medicamentos.';
        if (err?.status === 404) {
          mensajeError = 'El endpoint de medicamentos no está disponible en el backend.';
        } else if (err?.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.';
        } else if (err?.error?.message) {
          mensajeError = err.error.message;
          // Si hay un error SQL, mostrar información más clara
          if (mensajeError.includes('Unknown column') || mensajeError.includes('SQL')) {
            mensajeError = 'Error en la base de datos. Por favor, contacte al administrador del sistema.';
          }
        }
        
        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  filtrarMedicamentos() {
    const termino = this.searchTerm.toLowerCase();
    return this.medicamentos.filter(med =>
      med.nombre.toLowerCase().includes(termino) ||
      med.descripcion.toLowerCase().includes(termino) ||
      med.presentacion.toLowerCase().includes(termino)
    );
  }

  openModal(modo: string) {
    this.modoFormulario = modo;
    this.titleModal = modo === 'C' ? 'Registrar Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';
    const modalElement = document.getElementById('modalMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.form.reset();
    }
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = null;
    this.form.reset();
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      cantidad: medicamento.cantidad,
      fechaCompra: medicamento.fechaCompra,
      fechaVence: medicamento.fechaVence
    });
    this.openModal('E');
  }

  guardarMedicamento() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const medicamentoData = this.form.getRawValue();

    if (this.modoFormulario === 'C') {
      // Crear nuevo medicamento
      this.medicamentoService.guardarMedicamento(medicamentoData).subscribe({
        next: (data) => {
          Swal.fire('Creación exitosa', data.message, 'success');
          this.listarMedicamentos();
          this.closeModal();
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error');
        }
      });
    } else if (this.modoFormulario === 'E' && this.medicamentoSelected?.id) {
      // Actualizar medicamento existente
      const medicamentoActualizado = {
        ...this.medicamentoSelected,
        ...medicamentoData
      };

      this.medicamentoService.actualizarMedicamento(this.medicamentoSelected.id!, medicamentoActualizado).subscribe({
      next: (data) => {
      Swal.fire('Actualización exitosa', data.message, 'success');
      this.listarMedicamentos();
      this.closeModal();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error');
      }
      });
    }
  }

  eliminarMedicamento(medicamento: Medicamento) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el medicamento "${medicamento.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicamentoService.eliminarMedicamento(medicamento.id!).subscribe({
          next: (data) => {
            Swal.fire('Eliminado', data.message, 'success');
            this.listarMedicamentos();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Ocurrió un error', 'error');
          }
        });
      }
    });
  }
}
