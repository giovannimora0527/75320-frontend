import { Component } from '@angular/core';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';


import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, ReactiveFormsModule, NgForOf],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamento: Medicamento[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento;

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    presentacion: new FormControl(''),
    fechaCmpra: new FormControl(''),
    fechaVence: new FormControl('')
  });

  constructor(
    private medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicamentos();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(1)]],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required]],
      presentacion: ['', [Validators.required]],
      fechaCmpra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  
  listarMedicamentos() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamento = data;
        console.log('Medicamentos cargados:', this.medicamento);
      },
      error: (err) => console.error('Error al listar medicamentos:', err)
    });
  }

  guardarMedicamento() {
      if (this.modoFormulario === 'C') {
        this.form.get('activo').setValue(true);
      }
      if (this.form.valid) {
        if (this.modoFormulario.includes('C')) {
          // Modo Creación
          this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
            next: (data) => {
              console.log('Medicamento guardado:', data);
              Swal.fire('Creación exitosa', data.message, 'success');
              this.listarMedicamentos();
              this.closeModal();
            },
            error: (err) => {
              console.error('Error al guardar medicamento:', err);
              Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el medicamento.', 'error');
            }
          });
        } else {
          // Modo Edición
      }
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = new Medicamento();
    this.limpiarFormulario();
    // Cargamos los datos del usuario seleccionado en el formulario
    
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.openModal('E');
    this.limpiarFormulario();
  }   
  
  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      id: '',
      nombre: '',
      descripcion: '',
      presentacion: '',
      fechaCmpra: '',
      fechaVence: ''
    });
  }
}