import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
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
import { delay, map, Observable, of } from 'rxjs';

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
    pacientes: Paciente[] = [];
    dataSource = new MatTableDataSource<Paciente>([]);
    displayedColumns: string[] = ['id','usuarioId', 'tipoDocumento', 'numeroDocumento', 'nombres', 'apellidos', 'fechaNacimiento', 'genero', 'telefono', 'direccion', 'acciones'];
    titleModal: string = '';
    titleBoton: string = '';
    pacienteSelected: Paciente;
    titleSpinner: string = "";
  
    form: FormGroup = new FormGroup({
      usuarioId: new FormControl('', Validators.required),
      tipoDocumento: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', Validators.required),
      nombres: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      telefono: new FormControl(''),
      direccion: new FormControl('', Validators.required)
    });
  
    constructor(
      private readonly pacienteService: PacienteService,
      private readonly formBuilder: FormBuilder,
      private readonly spinner: NgxSpinnerService
    ) {
      this.listarPacientes();
      this.cargarFormulario();
      this.titleSpinner = "Cargando Pacientes...";
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    }
    
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Configurar filtro personalizado
        this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
          const searchString = filter.toLowerCase();
          return data.id?.toString().includes(searchString) ||
                 data.usuarioId?.toString().includes(searchString) ||
                 data.tipoDocumento?.toLowerCase().includes(searchString) ||
                 data.numeroDocumento?.toLowerCase().includes(searchString) ||
                 data.nombres?.toLowerCase().includes(searchString) ||
                 data.apellidos?.toLowerCase().includes(searchString) ||
                 data.fechaNacimiento?.toString().includes(searchString) ||
                 data.genero?.toLowerCase().includes(searchString) ||
                 data.telefono?.toLowerCase().includes(searchString) ||
                 data.direccion?.toLowerCase().includes(searchString);
        };
      }

    cargarFormulario() {
      this.form = this.formBuilder.group({
        usuarioId: ['', [Validators.required]],
        tipoDocumento: ['', [Validators.required]],
        numeroDocumento: ['', [Validators.required]],
        nombres: ['', [Validators.required]],
        apellidos: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        telefono: [''],
        direccion: ['', [Validators.required]]
      });
    }
  
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
  
    listarPacientes() {
      this.pacienteService.listarPacientes().subscribe({
        next: (data) => {
          console.log(data);
          this.pacientes = data;
          this.dataSource.data = data;
        },

        error: (err) => {
          this.spinner.hide();
          console.error('Error al listar pacientes:', err);
          Swal.fire('Error', 'Ocurrió un error al cargar los pacientes.', 'error');
        }
      });
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
        } else {
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

    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
        this.limpiarFormulario();
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
      this.limpiarFormulario();
      // Dejamos el formulario en blanco
      this.openModal('C');
    }
  
    abrirEditarPaciente(paciente: Paciente) {
      this.limpiarFormulario();
      this.pacienteSelected = paciente;
      this.form.get("usuarioId").setValue(this.pacienteSelected.usuarioId);
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
      usuarioId: '',
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      direccion: '',
    });
  }

  /**
   * Aplicar filtro a la tabla de Material
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
