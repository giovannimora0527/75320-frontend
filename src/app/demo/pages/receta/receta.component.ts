import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetaService } from './service/receta.service';

import { Receta } from './models/receta';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule
} from '@angular/forms';

import Swal from 'sweetalert2';

import Modal from 'bootstrap/js/dist/modal';

@Component({
    selector: 'app-receta',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './receta.component.html',
    styleUrl: './receta.component.scss'
})
export class RecetaComponent {
    modalInstance: Modal | null = null;
    modoFormulario: string = '';
    Recetas: Receta[] = [];
    titleModal: string = '';
    titleBoton: string = '';
    RecetaSelected: Receta;

    form: FormGroup = new FormGroup({
        id: new FormControl(''),
        cita_id: new FormControl(''),
        medicamento_id: new FormControl(''),
        dosis: new FormControl(''),
        indicaciones: new FormControl(''),
        fecha_creacion_registro: new FormControl(''),
    });

    constructor(
        private RecetaService: RecetaService,
        private readonly formBuilder: FormBuilder
    ) {
        this.listarRecetas();
    }

    listarRecetas() {
    this.RecetaService.listarRecetas().subscribe({
        next: (data) => {
        this.Recetas= data;
        console.log('Recetas cargados:', this.Recetas);
        },
        error: (error) => {
        console.error('Error fetching recetas:', error);
        }
    });
    }
    guardarRecetas() {
    if (this.modoFormulario === 'C') {
        this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
        if (this.modoFormulario.includes('C')) {
        // Modo Creación
        this.RecetaService.guardarRecetas(this.form.getRawValue()).subscribe({
            next: (data) => {
            console.log('Cita guardado:', data);
            Swal.fire('Creación exitosa', data.message, 'success');
            this.listarRecetas();
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
        this.titleModal = modo === 'C' ? 'Crear Receta' : 'Editar Receta';
        this.titleBoton = modo === 'C' ? 'Guardar Receta' : 'Actualizar Receta';
        this.modoFormulario = modo;
        const modalElement = document.getElementById('modalCrearReceta');
        if (modalElement) {
      // Verificar si ya existe una instancia del modal
        this.modalInstance ??= new Modal(modalElement);
        this.modalInstance.show();
    }
        }

        abrirNuevaReceta() {
        this.RecetaSelected = new Receta();
        this.limpiarFormulario();
        // Cargamos los datos del Cita seleccionado en el formulario
        
        // Dejamos el formulario en blanco
        this.openModal('C');
        }

        abrirEditarRecetas(Receta: Receta) {
        this.RecetaSelected = Receta;
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