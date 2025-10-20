import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss']
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento | null = null;
  filtroMedicamento: string = '';
  ordenActual: string = '';
  ascendente: boolean = true;

  form!: FormGroup;
  titleSpinner: string = '';

  constructor(
    private medicamentoService: MedicamentoService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
    this.listarMedicamento();
  }

  cargarFormulario() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      presentacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      fechaCompra: ['', Validators.required],
      fechaVence: ['', Validators.required],
      fechaCreacionRegistro: [''],
      fechaModificacionRegistro: [''],
      activo: [true]
    });
  }

  listarMedicamento() {
    this.titleSpinner = 'Pensando... en ti';
    this.spinner.show();

    this.medicamentoService.listarMedicamento().subscribe({
      next: (data) => {
        this.medicamentos = data;
        this.filtrarMedicamentos();
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error al listar medicamentos:', err);
        this.spinner.hide();
      }
    });
  }

  filtrarMedicamentos() {
    const texto = this.filtroMedicamento.toLowerCase();
    this.medicamentosFiltrados = this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(texto) || m.descripcion.toLowerCase().includes(texto)
    );
  }

  ordenarPor(campo: keyof Medicamento) {
    if (this.ordenActual === campo) {
      this.ascendente = !this.ascendente;
    } else {
      this.ordenActual = campo;
      this.ascendente = true;
    }

    this.medicamentosFiltrados.sort((a, b) => {
      const valorA = a[campo] ?? '';
      const valorB = b[campo] ?? '';
      return this.ascendente
        ? valorA.toString().localeCompare(valorB.toString())
        : valorB.toString().localeCompare(valorA.toString());
    });
  }

  guardarMedicamento() {
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    }

    if (this.form.valid) {
      Swal.fire({
        title: this.modoFormulario === 'C'
          ? '¿Desea crear este medicamento?'
          : '¿Desea actualizar este medicamento?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: this.modoFormulario === 'C' ? 'Sí, crear' : 'Sí, actualizar',
        denyButtonText: 'No guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.modoFormulario === 'C') {
            this.crearMedicamento();
          } else {
            this.actualizarMedicamento();
          }
        } else if (result.isDenied) {
          Swal.fire('Cambios no guardados', '', 'info');
        }
      });
    }
  }

  private crearMedicamento() {
    this.titleSpinner = 'Creando medicamento...';
    this.spinner.show();

    this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
      next: (data) => {
        this.spinner.hide();
        Swal.fire('Guardado', data[0]?.message || 'Medicamento creado exitosamente.', 'success');
        this.listarMedicamento();
        this.closeModal();
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el medicamento.', 'error');
      }
    });
  }

  actualizarMedicamento() {
    if (this.form.valid && this.medicamentoSelected) {
      const nombreForm = this.form.get('nombre')?.value.trim().toLowerCase();
      const presentacionForm = this.form.get('presentacion')?.value.trim().toLowerCase();

      const yaExiste = this.medicamentos.some(m =>
        m.id !== this.medicamentoSelected?.id &&
        m.nombre.trim().toLowerCase() === nombreForm &&
        m.presentacion.trim().toLowerCase() === presentacionForm
      );

      if (yaExiste) {
        Swal.fire('Error', 'Ya existe un medicamento con ese nombre y presentación.', 'error');
        return;
      }

      this.titleSpinner = 'Actualizando medicamento...';
      this.spinner.show();

      const medicamentoActualizado: Medicamento = {
        ...this.medicamentoSelected,
        ...this.form.getRawValue(),
        id: this.medicamentoSelected.id
      };

      this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Actualizado', data[0]?.message || 'Medicamento actualizado exitosamente.', 'success');
          this.listarMedicamento();
          this.closeModal();
        },
        error: (err) => {
          this.spinner.hide();
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al actualizar el medicamento.', 'error');
        }
      });
    }
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = new Medicamento();
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      fechaCompra: medicamento.fechaCompra,
      fechaVence: medicamento.fechaVence,
      fechaCreacionRegistro: medicamento.fechaCreacionRegistro,
      fechaModificacionRegistro: medicamento.fechaModificacionRegistro,
      activo: medicamento.activo
    });
    this.openModal('E');
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      presentacion: '',
      fechaCompra: '',
      fechaVence: '',
      fechaCreacionRegistro: '',
      fechaModificacionRegistro: '',
      activo: true
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
