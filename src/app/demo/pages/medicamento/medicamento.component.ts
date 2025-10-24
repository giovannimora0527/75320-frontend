import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento;
  titleSpinner: string = '';

  medicamentoList: Medicamento[] = [];
  medicamentoListFiltrada: Medicamento[] = [];

  filtroBusqueda: string = '';
  filtroEstado: string = '';
  filtroFecha: string = '';

  form: FormGroup;

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.titleSpinner = 'Cargando medicamentos...';
    this.spinner.show();
    this.listarMedicamentos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presentacion: ['', Validators.required],
      fechaCompra: [null, Validators.required],
      fechaVence: [null, Validators.required]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /** 🔄 Cargar medicamentos desde el backend */
  listarMedicamentos() {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (data) => {
        console.log('Medicamentos cargados:', data);
        this.medicamentoList = data;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar medicamentos:', error);
      }
    });
  }

  /** 🔍 Lógica de filtrado */
  aplicarFiltros() {
    const hoy = new Date();
    const busqueda = this.filtroBusqueda.toLowerCase().trim();

    this.medicamentoListFiltrada = this.medicamentoList.filter((med) => {
      const coincideTexto =
        med.nombre.toLowerCase().includes(busqueda) ||
        med.descripcion.toLowerCase().includes(busqueda);

      const fechaVence = new Date(med.fechaVence);
      const vigente = fechaVence >= hoy;
      const vencido = fechaVence < hoy;

      const coincideEstado =
        this.filtroEstado === ''
          ? true
          : this.filtroEstado === 'vigente'
          ? vigente
          : vencido;

      const coincideFecha =
        this.filtroFecha === ''
          ? true
          : new Date(med.fechaCompra).toISOString().slice(0, 10) === this.filtroFecha;

      return coincideTexto && coincideEstado && coincideFecha;
    });
  }

  /** Cierra el modal */
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /** Abre el modal según el modo */
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Registrar Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar' : 'Actualizar';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = new Medicamento();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    // Rellenar el formulario con los datos existentes
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
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    // Construir objeto para el backend
    const medicamentoRq: any = {
      nombre: this.form.get('nombre')?.value,
      descripcion: this.form.get('descripcion')?.value,
      presentacion: this.form.get('presentacion')?.value,
      fechaCompra: this.form.get('fechaCompra')?.value,
      fechaVence: this.form.get('fechaVence')?.value
    };

    if (this.modoFormulario === 'C') {
      this.medicamentoService.guardarMedicamento(medicamentoRq).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.message, 'success');
          this.listarMedicamentos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating medicamento:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else {
      medicamentoRq.id = this.medicamentoSelected.id;
      this.medicamentoService.actualizarMedicamento(medicamentoRq).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.message, 'success');
          this.listarMedicamentos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating medicamento:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    }
  }
}
