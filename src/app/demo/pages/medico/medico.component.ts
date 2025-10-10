import { Component } from '@angular/core';
import { MedicoService } from './service/medico.service';
import { CommonModule } from '@angular/common';
import { Medico } from './models/medico';

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from 'src/app/services/common/util.service';
import { Especializacion } from './models/especializacion';

@Component({
  selector: 'app-medico',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: Medico;

  medicoList: Medico[] = [];
  especializacionesList: Especializacion[] = [];

  form: FormGroup = new FormGroup({
    tipoDocumento: new FormControl('', Validators.required),
    numeroDocumento: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    telefono: new FormControl(''),
    registroProfesional: new FormControl('', Validators.required),
    especializacionId: new FormControl(null, Validators.required)
  });

  constructor(
    private readonly medicoService: MedicoService,
    private readonly utilService: UtilService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarMedicos();
    this.listarEspecializaciones();
    this.inicializarFormulario();
  }

  listarEspecializaciones() {
    this.utilService.listarEspecializaciones().subscribe({
      next: (data) => {
        console.log(data);
        this.especializacionesList = data;
      },
      error: (error) => {
        console.error('Error fetching especializaciones:', error);
      }
    });
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: [''],
      registroProfesional: ['', [Validators.required]],
      especializacionId: [null, [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicos() {
    this.medicoService.getMedicos().subscribe({
      next: (data) => {
        console.log(data);
        this.medicoList = data;
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Médico' : 'Editar Médico';
    this.titleBoton = modo === 'C' ? 'Guardar Médico' : 'Actualizar Médico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedico');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = new Medico();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarMedico(medico: Medico) {
    this.medicoSelected = medico;
    this.openModal('E');
  }

  guardarMedico() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear médico
      this.medicoService.guardarMedico(this.form.getRawValue()).subscribe({
        next: (data) => {          
          Swal.fire('Éxito', data.message, 'success');
          this.listarMedicos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating medico:', error);
          Swal.fire("Error", error.error.message, "error");
        }
      });
    } else {
      // Editar médico
      const medicoActualizado = { ...this.medicoSelected, ...this.form.getRawValue() };      
      this.medicoService.actualizarMedico(medicoActualizado).subscribe({
        next: (data) => { 
          Swal.fire('Éxito', data.message, 'success');
          this.listarMedicos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating medico:', error);
          Swal.fire("Error", error.error.message, "error");
        }
      });
    }
  }
}
