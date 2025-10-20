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
  ReactiveFormsModule
} from '@angular/forms';
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
export class PacienteComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  paciente: Paciente[] = [];
  dataSource = new MatTableDataSource<Paciente>([]);
  displayedColumns: string[] = [
    'id',
    'usuarioId',
    'numeroDocumento',
    'nombres',
    'apellidos',
    'fechaNacimiento',
    'genero',
    'telefono',
    'direccion',
    'acciones'
  ];
  titleModal: string = '';
  titleBoton: string = '';
  pacienteSelected!: Paciente;
  titleSpinner: string = "";

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    usuarioId: new FormControl(''),
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    genero: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl(''),
  });

  constructor(
    private pacienteService: PacienteService,
    private spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder
  ) {
    this.listarPacientes();
    this.cargarFormulario();
    this.titleSpinner = "Prueba spinner";
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Paciente, filter: string) => {
      const searchString = filter.toLowerCase();
      return (
        data.tipoDocumento?.toLowerCase().includes(searchString) ||
        data.numeroDocumento?.toLowerCase().includes(searchString) ||
        data.nombres?.toLowerCase().includes(searchString) ||
        data.apellidos?.toLowerCase().includes(searchString) ||
        data.fechaNacimiento?.toLowerCase().includes(searchString) ||
        data.genero?.toLowerCase().includes(searchString) ||
        data.telefono?.toLowerCase().includes(searchString) ||
        data.direccion?.toLowerCase().includes(searchString)
      );
    };
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id: [''],
      usuarioId: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: [''],
      telefono: ['', [Validators.minLength(7)]],
      direccion: ['', [Validators.minLength(5), Validators.maxLength(100)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.titleSpinner = "Cargando pacientes...";
    this.spinner.show();
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.paciente = data;
        this.dataSource.data = data;
        this.spinner.hide();
        console.log('Pacientes cargados:', this.paciente);
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

    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
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
        const pacienteActualizado = { ...this.pacienteSelected, ...this.form.getRawValue() };
        this.pacienteService.actualizarPaciente(pacienteActualizado).subscribe({
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
        });
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
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = {
      id: 0,
      usuarioId: 0,
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      direccion: ''
    };
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.limpiarFormulario();
    this.pacienteSelected = paciente;
    this.form.patchValue(this.pacienteSelected);
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
      direccion: ''
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getGeneroColor(rol: string): string {
    switch (rol) {
      case 'F': return 'primary';
      case 'M': return 'accent';
      default: return '';
    }
  }

  getEstadoColor(activo: boolean): string {
    return activo ? 'primary' : 'warn';
  }
}
