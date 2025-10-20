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
      }, 3000);
  
    }
    
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Configurar filtro personalizado
        this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
          const searchString = filter.toLowerCase();
          return data.nombres?.toLowerCase().includes(searchString) ||
                 data.apellidos?.toLowerCase().includes(searchString) ||
                 data.numeroDocumento?.toLowerCase().includes(searchString) ||
                 data.id?.toString().includes(searchString);
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
      this.titleSpinner = "Cargando pacientes...";
      this.spinner.show();
      console.log('Entro a cargar usuarios');
      this.pacienteService.listarPacientes().subscribe({
        next: (data) => {
          console.log(data);
          this.pacientes = data;
          this.dataSource.data = data;
          this.spinner.hide();
          console.log('Pacientes cargados:', this.pacientes);
        },

        error: (err) => {
          this.spinner.hide();
          console.error('Error al listar pacientes:', err);
          Swal.fire('Error', 'Ocurrió un error al cargar los pacientes.', 'error');
        }
      });
    }
  
  
    guardarPaciente() {
      this.titleSpinner = this.modoFormulario === 'C' ? "Creando paciente..." : "Actualizando paciente...";
      this.spinner.show();
      if (this.modoFormulario === 'C') {
        this.form.get('activo').setValue(true);
      }
      if (this.form.valid) {
            if (this.modoFormulario.includes('C')) {
              // Modo Creación
              this.pacienteService.guardarPaciente(this.form.getRawValue()).subscribe({
                next: (data) => {
                  this.spinner.hide();
                  console.log('Paciente guardado:', data);
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
