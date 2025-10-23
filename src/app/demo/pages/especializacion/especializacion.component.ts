import { Component } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { CommonModule } from '@angular/common';
import { Especializacion } from './models/especializacion';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgxSpinnerModule ],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})

export class EspecializacionComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion;
  titleSpinner: string = '';

  especializacionList:Especializacion[] =[];
  form: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    codigoEspecializacion: new FormControl('', Validators.required),
  });

    constructor(
        private readonly especializacionService: EspecializacionService,
        private readonly formBuilder: FormBuilder,
        private readonly spinner: NgxSpinnerService
        )
        {
            this.listarEspecializacion();
            this.inicializarFormulario();

        }
    
    listarEspecializacion() {
      this.titleSpinner = "Cargando especializaciones...";
      this.spinner.show();
      console.log('Entro a cargar usuarios');
    this.especializacionService.getEspecializacion().subscribe({
      next: (data) => {
        console.log(data);
        this.especializacionList = data;
        this.spinner.hide();
        console.log('Especializaciones cargadas:', this.especializacionList);
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error fetching especializaciones:', error);
      }
    });
    }

    inicializarFormulario(){
        this.form = this.formBuilder.group({
            nombre: ['', [Validators.required]],
            descripcion: [''],
            codigoEspecializacion: ['', [Validators.required]],
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
        this.titleModal = modo === 'C' ? 'Crear Especializacion' : 'Editar Especializacion';
        this.titleBoton = modo === 'C' ? 'Guardar Especializacion' : 'Actualizar Especializacion';
        this.modoFormulario = modo;
        const modalElement = document.getElementById('modalCrearEspecializacion');
        if (modalElement) {
            // Verificar si ya existe una instancia del modal
            this.modalInstance ??= new Modal(modalElement);
            this.modalInstance.show();
        }
    }
    abrirNuevaEspecializacion() {
          this.especializacionSelected = new Especializacion();
          // Dejamos el formulario en blanco
          this.openModal('C');
        }
    abrirEditarEspecializacion(especializacion: Especializacion) {
          this.especializacionSelected = especializacion;
          this.openModal('E');
        }
    guardarEspecializacion() {
            if (this.form.invalid) {
              this.form.markAllAsTouched();
              Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
              return;
            }

            this.titleSpinner = this.modoFormulario === 'C' ? "Guardando especialización..." : "Actualizando especialización...";
            this.spinner.show();

        if (this.modoFormulario === 'C') {
                    // Crear especializacion
                    this.especializacionService.guardarEspecializacion(this.form.getRawValue()).subscribe({
                      next: (data) => {  
                        this.spinner.hide();        
                        Swal.fire('Éxito', data.message, 'success');
                        this.listarEspecializacion();
                        this.closeModal();
                      },
                      error: (error) => {
                        this.spinner.hide();
                        console.error('Error creatinng especializacion:', error);
                        Swal.fire("Error", error.error.message, "error");
                      }
                    });
                  }
        else {
                    // Editar especializacion
                  const especializacionActualizado = { ...this.especializacionSelected, ...this.form.getRawValue() };      
                  this.especializacionService.actualizarEspecializacion(especializacionActualizado).subscribe({
                    next: (data) => { 
                      this.spinner.hide();
                      Swal.fire('Éxito', data.message, 'success');
                      this.listarEspecializacion();
                      this.closeModal();
                    },
                    error: (error) => {
                      this.spinner.hide();
                      console.error('Error updating especializacion:', error);
                      Swal.fire("Error", error.error.message, "error");
                    }  
                  });
                  }

        }




}



