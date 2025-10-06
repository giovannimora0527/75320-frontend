import { Component } from '@angular/core';
import { Medico } from './models/medico';
import { MedicoService } from './service/medico.service';
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
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicamentoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medico: Medico[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medico;

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
    private medicoService: MedicoService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedico();
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

  listarMedico() {
    console.log('Entro a cargar medicos');
    this.medicoService.listarMedico().subscribe({
      next: (data) => {
        this.medicos = data;
        console.log('Medicamento cargados:', this.medicos);
      },
      error: (err) => console.error('Error al listar medicos:', err)
    });
  }

  guardarMedicamento() {
    if (this.modoFormulario === 'C') {
      this.form.get('activo')?.setValue(true);
    }
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.medicoService.guardarMedico(this.form.getRawValue()).subscribe({
          next: (data) => {
            console.log('medicamento guardado:', data);
            Swal.fire('Creación exitosa', data[0]?.message || 'Medico guardado exitosamente.', 'success');
            this.listarMedico();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error al guardar medico:', err);
            Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el medico.', 'error');
          }
        });
      } else {
        // Modo Edición
      }
    }
  }
  actualizarMedico() {
    if (this.form.valid && this.medicamentoSelected) {
      const medicamentoActualizado = {
        ...this.medicoSelected,
        ...this.form.getRawValue()
      };
      this.medicoService.actualizarMedico(medicamentoActualizado).subscribe({
        next: (data) => {
          Swal.fire('Actualización exitosa', data[0]?.message || 'Medico actualizado exitosamente.', 'success');
          this.listarMedico();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al actualizar medico:', err);
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al actualizar el medico.', 'error');
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
      this.titleModal = modo === 'C' ? 'Crear Medico' : 'Editar Medico';
      this.titleBoton = modo === 'C' ? 'Guardar Medico' : 'Actualizar Medico';
      this.modoFormulario = modo;
      const modalElement = document.getElementById('modalCrearMedico');
      if (modalElement) {
        // Verificar si ya existe una instancia del modal
        this.modalInstance ??= new Modal(modalElement);
        this.modalInstance.show();
      }
    }
      abrirNuevoMedico() {
        this.medicamentoSelected = new Medico();
        this.limpiarFormulario();
        // Cargamos los datos del usuario seleccionado en el formulario
        
        // Dejamos el formulario en blanco
        this.openModal('C');
      }
    
      abrirEditarMedicamento(medico: Medico) {
        this.medicoSelected = medico;
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