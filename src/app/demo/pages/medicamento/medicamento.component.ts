import { Component } from '@angular/core';
import { Medicamento } from './models/medicamento';
import { MedicamentoService } from './service/medicamento.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { delay, map, Observable, of } from 'rxjs';


@Component({
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamentos: Medicamento[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    presentacion: new FormControl(''),
    fechaCompra: new FormControl(''),
    fechaVence: new FormControl(''),
    fechaCreacionRegistro: new FormControl(''),
    fechaModificacionRegistro: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicamento();
    this.cargarFormulario();
  }
   cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required,]],
      descripcion: ['', [Validators.required,]],
      presentacion: ['', [Validators.required]],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]],
      fechaCreacionRegistro: ['', []],
      fechaModificacionRegistro: ['', []],
      activo: ['']

      
    });
  }

  listarMedicamento() {
    console.log('Entro a cargar medicamentos');
    this.medicamentoService.listarMedicamento().subscribe({
      next: (data) => {
        this.medicamentos = data;
        console.log('Medicamento cargados:', this.medicamentos);
      },
      error: (err) => console.error('Error al listar medicamentos:', err)
    });
  }

  guardarMedicamento() {
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    }
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
          next: (data) => {
            console.log('medicamento guardado:', data);
            Swal.fire('Creación exitosa', data[0]?.message || 'Medicamento guardado exitosamente.', 'success');
            this.listarMedicamento();
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
  actualizarMedicamento() {
    if (this.form.valid && this.medicamentoSelected) {
      const medicamentoActualizado = {
        ...this.medicamentoSelected,
        ...this.form.getRawValue()
      };
      this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({
        next: (data) => {
          Swal.fire('Actualización exitosa', data[0]?.message || 'Medicamento actualizado exitosamente.', 'success');
          this.listarMedicamento();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al actualizar medicamento:', err);
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al actualizar el medicamento.', 'error');
        }
      });
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
          nombre: '',
          descripcion: '',
          presentacion: '',
          fechaCompra: '',
          fechaVence: '',
          fechaModificacionRegistro: '',
          activo:''
        });
      }
    }
    

  
  






