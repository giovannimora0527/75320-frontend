import { Component } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';
import { Paciente } from './models/paciente';

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})

export class PacienteComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected: Paciente;

  pacienteList: Paciente[] =[];

  form: FormGroup = new FormGroup({
    usuarioId: new FormControl('', Validators.required),
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    fechaNacimiento: new FormControl('', Validators.required),
    genero: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl(''),
  });

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder

  ){


    this.listarPacientes();
    this.inicializarFormulario();

  }

  listarPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        console.log(data);
        this.pacienteList = data;
      },
      error: (error) => {
        console.error('Error fetching pacientes:', error);
      }
    });
    }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      usuarioId: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      genero: [''],
      telefono: [''],
      direccion: [''],
      });
    }
  get f(): { [key: string]: AbstractControl } {
  return this.form.controls;
  }

  closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
  }
  
  openModal(modo: string) {
      this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
      this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
      this.modoFormulario = modo;
      const modalElement = document.getElementById('modalCrearPaciente');
      if (modalElement) {
        // Verificar si ya existe una instancia del modal
        this.modalInstance ??= new Modal(modalElement);
        this.modalInstance.show();
      }
  }

  abrirNuevoPaciente() {
      this.pacienteSelected = new Paciente();
      // Dejamos el formulario en blanco
      this.openModal('C');
    }
  
    abrirEditarPaceinte(paciente: Paciente) {
      this.pacienteSelected = paciente;
      this.openModal('E');
    }
    guardarPaciente() {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
          return;
        }
      
      if (this.modoFormulario === 'C') {
            // Crear paciente
            this.pacienteService.guardarPaciente(this.form.getRawValue()).subscribe({
              next: (data) => {          
                Swal.fire('Éxito', data.message, 'success');
                this.listarPacientes();
                this.closeModal();
              },
              error: (error) => {
                console.error('Error creating paciente:', error);
                Swal.fire("Error", error.error.message, "error");
              }
            });
          }
      else {
            // Editar paciente
          const pacienteActualizado = { ...this.pacienteSelected, ...this.form.getRawValue() };      
          this.pacienteService.actualizarPaciente(pacienteActualizado).subscribe({
            next: (data) => { 
              Swal.fire('Éxito', data.message, 'success');
              this.listarPacientes();
              this.closeModal();
            },
            error: (error) => {
              console.error('Error updating paciente:', error);
              Swal.fire("Error", error.error.message, "error");
            }  
          });
          }
    }
  
}