import { Component, OnInit } from '@angular/core';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-medicamentos',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.scss'
})
export class MedicamentosComponent implements OnInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamentos: Medicamento[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento = {} as Medicamento;

  form: FormGroup = new FormGroup({});

  constructor(
    private medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.cargarFormulario();
  }

  ngOnInit() {
    this.listarMedicamentos();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      presentacion: ['', [Validators.required]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      estado: ['Activo', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamentos() {
    const medicamentosGuardados = this.cargarMedicamentosDesdeLocalStorage();
    
    if (medicamentosGuardados.length > 0) {
      this.medicamentos = medicamentosGuardados;
    }

    this.medicamentoService.getMedicamentos().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.medicamentos = data;
          this.guardarMedicamentosEnLocalStorage(data);
        } else if (this.medicamentos.length === 0) {
          this.cargarDatosEjemplo();
        }
      },
      error: (err) => {
        if (this.medicamentos.length === 0) {
          this.cargarDatosEjemplo();
        }
      }
    });
  }

  private cargarDatosEjemplo() {
    this.medicamentos = [
      {
        id: 1,
        nombre: 'Paracetamol',
        codigo: 'MED-001',
        presentacion: 'Tabletas',
        descripcion: 'Analgésico y antipirético',
        precio: 5000,
        stock: 100,
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'Ibuprofeno',
        codigo: 'MED-002',
        presentacion: 'Cápsulas',
        descripcion: 'Antiinflamatorio no esteroideo',
        precio: 8000,
        stock: 50,
        estado: 'Activo'
      },
      {
        id: 3,
        nombre: 'Amoxicilina',
        codigo: 'MED-003',
        presentacion: 'Suspensión',
        descripcion: 'Antibiótico de amplio espectro',
        precio: 12000,
        stock: 25,
        estado: 'Activo'
      }
    ];
    this.guardarMedicamentosEnLocalStorage(this.medicamentos);
  }

  private guardarMedicamentosEnLocalStorage(medicamentos: Medicamento[]) {
    try {
      localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  private cargarMedicamentosDesdeLocalStorage(): Medicamento[] {
    try {
      const medicamentosGuardados = localStorage.getItem('medicamentos');
      if (medicamentosGuardados) {
        return JSON.parse(medicamentosGuardados);
      }
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
    }
    return [];
  }

  guardarMedicamento() {
    if (this.form.valid) {
      const medicamentoData = this.form.getRawValue();
      
      if (this.modoFormulario === 'C') {
        this.crearMedicamento(medicamentoData);
      } else {
        this.actualizarMedicamento(medicamentoData);
      }
    } else {
      this.marcarCamposComoSucios();
    }
  }

  private crearMedicamento(medicamentoData: any) {
    medicamentoData.id = this.obtenerSiguienteIdMedicamento();
    
    this.medicamentoService.crearMedicamento(medicamentoData).subscribe({
      next: (data) => {
        this.medicamentos.push(medicamentoData);
        this.guardarMedicamentosEnLocalStorage(this.medicamentos);
        this.mostrarMensajeExito('Creación exitosa', 'Medicamento creado correctamente');
      },
      error: (err) => {
        this.medicamentos.push(medicamentoData);
        this.guardarMedicamentosEnLocalStorage(this.medicamentos);
        this.mostrarMensajeExito('Creación exitosa', 'Medicamento creado correctamente (guardado localmente)');
      }
    });
  }

  private actualizarMedicamento(medicamentoData: any) {
    medicamentoData.id = this.medicamentoSelected.id;
    
    this.medicamentoService.actualizarMedicamento(medicamentoData).subscribe({
      next: (data) => {
        this.actualizarMedicamentoEnLista(medicamentoData);
        this.mostrarMensajeExito('Actualización exitosa', 'Medicamento actualizado correctamente');
      },
      error: (err) => {
        this.actualizarMedicamentoEnLista(medicamentoData);
        this.mostrarMensajeExito('Actualización exitosa', 'Medicamento actualizado correctamente (guardado localmente)');
      }
    });
  }

  private actualizarMedicamentoEnLista(medicamentoData: Medicamento) {
    const index = this.medicamentos.findIndex(m => m.id === medicamentoData.id);
    if (index !== -1) {
      this.medicamentos[index] = medicamentoData;
      this.guardarMedicamentosEnLocalStorage(this.medicamentos);
    }
  }

  private mostrarMensajeExito(titulo: string, mensaje: string) {
    Swal.fire(titulo, mensaje, 'success');
    this.closeModal();
  }

  private obtenerSiguienteIdMedicamento(): number {
    if (this.medicamentos.length === 0) return 1;
    const maxId = Math.max(...this.medicamentos.map(m => m.id));
    return maxId + 1;
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
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

  abrirNuevoMedicamento() {
    this.medicamentoSelected = {} as Medicamento;
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.limpiarFormulario();
    this.cargarDatosEnFormulario(medicamento);
    this.openModal('E');
  }

  private cargarDatosEnFormulario(medicamento: Medicamento) {
    this.form.patchValue({
      nombre: medicamento.nombre,
      codigo: medicamento.codigo,
      presentacion: medicamento.presentacion,
      descripcion: medicamento.descripcion || '',
      precio: medicamento.precio || 0,
      stock: medicamento.stock || 0,
      estado: medicamento.estado
    });
  }

  eliminarMedicamento(medicamento: Medicamento) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar el medicamento ${medicamento.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicamentoService.eliminarMedicamento(medicamento.id).subscribe({
          next: () => {
            this.eliminarMedicamentoDeLista(medicamento.id);
            Swal.fire('Eliminado!', 'El medicamento ha sido eliminado.', 'success');
          },
          error: (err) => {
            this.eliminarMedicamentoDeLista(medicamento.id);
            Swal.fire('Eliminado!', 'El medicamento ha sido eliminado (eliminado localmente).', 'success');
          }
        });
      }
    });
  }

  private eliminarMedicamentoDeLista(id: number) {
    this.medicamentos = this.medicamentos.filter(m => m.id !== id);
    this.guardarMedicamentosEnLocalStorage(this.medicamentos);
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: '',
      codigo: '',
      presentacion: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      estado: 'Activo'
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private marcarCamposComoSucios() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }
}