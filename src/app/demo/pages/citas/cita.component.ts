import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from './service/cita.service';

import { Cita } from './models/cita';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule
} from '@angular/forms';

import Swal from 'sweetalert2';

import Modal from 'bootstrap/js/dist/modal';

@Component({
    selector: 'app-cita',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cita.component.html',
    styleUrl: './cita.component.scss'
})
export class CitaComponent {
    modalInstance: Modal | null = null;
    modoFormulario: string = '';
    Citas: Cita[] = [];
    titleModal: string = '';
    titleBoton: string = '';
    CitaSelected: Cita;

    form: FormGroup = new FormGroup({
        id: new FormControl(''),
        estado: new FormControl(''),
        motivo: new FormControl(''),
        fecha_hora: new FormControl(''),
    });

    constructor(
        private CitaService: CitaService,
        private readonly formBuilder: FormBuilder
    ) {
        this.listarCitas();
    }

    listarCitas() {
    this.CitaService.listarCitas().subscribe({
        next: (data) => {
        this.Citas= data;
        console.log('Citas cargados:', this.Citas);
        },
        error: (error) => {
        console.error('Error fetching citas:', error);
        }
    });
    }
    guardarCita() {
    if (this.modoFormulario === 'C') {
        this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
        if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.CitaService.guardarCita(this.form.getRawValue()).subscribe({
            next: (data) => {
            console.log('Cita guardado:', data);
            Swal.fire('Creación exitosa', data.message, 'success');
            this.listarCitas();
            this.closeModal();
            },
            error: (err) => {
            console.error('Error al guardar Cita:', err);
            Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear la Cita.', 'error');
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
        }
        }
    
        openModal(modo: string) {
        this.titleModal = modo === 'C' ? 'Crear Cita' : 'Editar Cita';
        this.titleBoton = modo === 'C' ? 'Guardar Cita' : 'Actualizar Cita';
        this.modoFormulario = modo;
        const modalElement = document.getElementById('modalCrearCita');
        if (modalElement) {
      // Verificar si ya existe una instancia del modal
        this.modalInstance ??= new Modal(modalElement);
        this.modalInstance.show();
    }
        }

        abrirNuevaCita() {
        this.CitaSelected = new Cita();
        this.limpiarFormulario();
        // Cargamos los datos del Cita seleccionado en el formulario
        
        // Dejamos el formulario en blanco
        this.openModal('C');
        }

        abrirEditarCitas(Cita: Cita) {
        this.CitaSelected = Cita;
        this.openModal('E');
        this.limpiarFormulario();
        }
    
        limpiarFormulario() {
        this.form.markAsPristine();
        this.form.markAsUntouched();
        this.form.reset({
            paciente_id: '',
            medico_id: '',
            nombres: '',
            fecha_hora: '',
            estado: '',
            motivo: ''
        });
        }

    }