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
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    });
  }

  listarMedicamentos() {
    this.isLoading = true;
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al listar medicamentos:', err);
        this.isLoading = false;
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
