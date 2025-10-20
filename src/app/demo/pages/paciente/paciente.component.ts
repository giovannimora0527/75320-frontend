import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

// Angular Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-paciente',
    imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements AfterViewInit{

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    modalInstance: Modal | null = null;
    modoFormulario: string = '';
    paciente: Paciente[] = [];
    dataSource = new MatTableDataSource<Paciente>([]);
    displayedColumns: string[] = ['id', 'tipoDocumento', 'numeroDocumento', 'nombres', 'apellidos', 'acciones'];
    titleModal: string = '';
    titleBoton: string = '';
    pacienteSelected: Paciente;
  
    titleSpinner: string = "";

    form: FormGroup = new FormGroup({
    id: new FormControl(''),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    genero: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl('')
  });

    constructor(
        private readonly pacienteService: PacienteService,
        private readonly formBuilder: FormBuilder,
        private readonly spinner: NgxSpinnerService
  ) {
    this.listarPacientes();
    this.cargarFormulario(); 
  }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Configurar filtro personalizado
      this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
        const searchString = filter.toLowerCase();
        return data.numeroDocumento?.toLowerCase().includes(searchString) ||
              data.nombres?.toLowerCase().includes(searchString) ||
              data.apellidos?.toLowerCase().includes(searchString) ||
              data.fechaNacimiento?.toLowerCase().includes(searchString) ||
              data.genero?.toLowerCase().includes(searchString) ||
              data.telefono?.toLowerCase().includes(searchString) ||
              data.direccion?.toLowerCase().includes(searchString) ||
              data.id?.toString().includes(searchString);
            
      };
    }
    
    

      cargarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombres: [''],
      apellidos: [''],
      fechaNacimiento: [''],
      genero: [''],
      telefono: [''],
      direccion: ['']
    });
  }

    /**
   * Servicio de listar Pacientes.
   */
  listarPacientes() {
    console.log('Entro a cargar Pacientes');
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.paciente= data;
        console.log('Pacientes cargados:', this.paciente);
        this.dataSource.data = this.paciente;
      },
      error: (err) => console.error('Error al listar Pacientes:', err)
    });
  }

      agregarPaciente() {
        this.titleSpinner = this.modoFormulario === 'C' ? "Creando paciente..." : "Actualizando paciente...";
        this.spinner.show();
        if (this.form.valid) {
          if (this.modoFormulario.includes('C')) {
            // Modo Creación
            this.pacienteService.agregarPaciente(this.form.getRawValue()).subscribe({
              next: (data) => {
                this.spinner.hide();
                console.log('paciente guardado:', data);
                Swal.fire('Creación exitosa', data.message, 'success');
                this.listarPacientes();
                this.closeModal();
              },
              error: (err) => {
                this.spinner.hide();
                console.error('Error al guardar paciente:', err);
                Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el paciente.', 'error');
              }
            });
          } else {
            // Modo Edición
            const pacienteActualizado = { ...this.pacienteSelected, ...this.form.getRawValue() };
            console.log(pacienteActualizado);
            this.pacienteService.actualizarPaciente(pacienteActualizado)
            .subscribe(
              {
                next: (data) => {    
                  this.spinner.hide();         
                  Swal.fire('Actualización exitosa', data.message, 'success');
                  this.listarPacientes();
                  this.closeModal();
                },
                error: (error) => {
                  this.spinner.hide();
                  console.error('Error al actualizar paciente:', error);
                  Swal.fire('Error', error.error?.message || 'Ocurrió un error al actualizar el paciente.', 'error');
                } 
              }
            );
            
          }
        } else {
          this.spinner.hide();
        }
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
    const modalElement = document.getElementById('modalListarPaciente');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

    abrirNuevoPaciente() {
      this.pacienteSelected = new Paciente();
      this.limpiarFormulario();    
      // Dejamos el formulario en blanco
      this.openModal('C');
    }
  
    abrirEditarPaciente(paciente: Paciente) {
      this.limpiarFormulario();
      this.pacienteSelected = paciente;
      this.form.get("tipoDocumento").setValue(this.pacienteSelected.tipoDocumento);
      this.form.get("numeroDocumento").setValue(this.pacienteSelected.numeroDocumento);
      this.form.get("nombres").setValue(this.pacienteSelected.nombres);
      this.form.get("apellidos").setValue(this.pacienteSelected.apellidos);
      this.form.get("fechaNacimiento").setValue(this.pacienteSelected.fechaNacimiento);
      this.form.get("genero").setValue(this.pacienteSelected.genero);
      this.form.get("telefono").setValue(this.pacienteSelected.telefono);
      this.form.get("direccion").setValue(this.pacienteSelected.direccion);
      this.openModal('E');
    }

      limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      direccion: ''
    });
  }


}

