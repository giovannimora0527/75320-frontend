<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { EspecializacionService } from './service/especializacion.service';
=======
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Especializacion } from './models/especializacion';
import { EspecializacionService } from './service/especializacion.service';
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
import { MAT_DATE_LOCALE } from '@angular/material/core';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)

@Component({
  selector: 'app-especializacion',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './especializaciones.component.html',
  styleUrls: ['./especializaciones.component.scss']
})
export class EspecializacionComponent implements OnInit {
  modalInstance: Modal | null = null;
  especializaciones: any[] = [];
  form!: FormGroup;

  constructor(
    private especializacionService: EspecializacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.listarEspecializaciones();
  }

  listarEspecializaciones(): void {
    this.especializacionService.getEspecializaciones().subscribe({
      next: (data: any) => {
        console.log('📦 Especializaciones desde backend:', data);

        if (Array.isArray(data)) {
          this.especializaciones = data;
        } else if (data && typeof data === 'object') {
          this.especializaciones = data.content || data.data || [];
        } else {
          this.especializaciones = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al listar especializaciones', err);
        this.especializaciones = [];
=======
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
  templateUrl: './especializaciones.component.html',
  styleUrls: ['./especializaciones.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class EspecializacionComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  especializaciones: Especializacion[] = [];
  dataSource = new MatTableDataSource<Especializacion>([]);
  displayedColumns: string[] = [
    'id', 'nombre', 'descripcion', 'codigoEspecializacion', 'acciones'
  ];
  titleModal: string = '';
  titleBoton: string = '';
  especializacionSelected: Especializacion | null = null;
  titleSpinner: string = "";

  form!: FormGroup;

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
    this.listarEspecializacion();
    this.titleSpinner = "Cargando especializaciones...";
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 1500);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Filtro personalizado
    this.dataSource.filterPredicate = (data: Especializacion, filter: string) => {
      const search = filter.toLowerCase();
      return (
        data.id?.toString().includes(search) ||
        data.nombre?.toLowerCase().includes(search) ||
        data.descripcion?.toLowerCase().includes(search) ||
        data.codigoEspecializacion?.toLowerCase().includes(search)
      );
    };
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigoEspecializacion: ['', Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarEspecializacion() {
    this.especializacionService.listarEspecialiazaciones().subscribe({
      next: (data) => {
        this.especializaciones = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al listar especializaciones:', err);
        Swal.fire('Error', 'Ocurrió un error al cargar las especializaciones.', 'error');
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
      }
    });
  }

<<<<<<< HEAD
  abrirNuevaEspecializacion(): void {
    this.form.reset();
=======
  guardarEspecializacion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      const nuevaEspecializacion = { ...this.form.getRawValue() };

      this.especializacionService.guardarEspecializacion(nuevaEspecializacion).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.message || 'Especialización creada correctamente', 'success');
          this.listarEspecializacion();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear especialización:', error);
          Swal.fire('Error', error.error.message || 'No se pudo crear la especialización', 'error');
        }
      });
    } else if (this.modoFormulario === 'E' && this.especializacionSelected) {
      const especializacionActualizada = {
        ...this.especializacionSelected,
        ...this.form.getRawValue(),
      };

      this.especializacionService.actualizarEspecializacion(especializacionActualizada).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.message || 'Especialización actualizada correctamente', 'success');
          this.listarEspecializacion();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar especialización:', error);
          Swal.fire('Error', error.error.message || 'No se pudo actualizar la especialización', 'error');
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
    this.titleModal = modo === 'C' ? 'Crear Especialización' : 'Editar Especialización';
    this.titleBoton = modo === 'C' ? 'Guardar Especialización' : 'Actualizar Especialización';
    this.modoFormulario = modo;

>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

<<<<<<< HEAD
  closeModal(): void {
    this.modalInstance?.hide();
  }

  guardarEspecializacion(): void {
    if (this.form.invalid) {
      Swal.fire('⚠️ Error', 'Complete todos los campos requeridos', 'warning');
      return;
    }

    const especializacionData = this.form.value;

    this.especializacionService.guardarEspecializacion(especializacionData).subscribe({
      next: () => {
        Swal.fire('✅ Éxito', 'Especialización guardada correctamente', 'success');
        this.listarEspecializaciones();
        this.closeModal();
      },
      error: (err) => {
        console.error('❌ Error al guardar especialización', err);
        Swal.fire('❌ Error', 'No se pudo guardar la especialización', 'error');
      }
    });
=======
  abrirNuevaEspecializacion() {
    this.especializacionSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarEspecializacion(especializacion: Especializacion) {
    this.especializacionSelected = especializacion;
    this.form.patchValue({
      nombre: especializacion.nombre,
      descripcion: especializacion.descripcion,
      codigoEspecializacion: especializacion.codigoEspecializacion
    });
    this.openModal('E');
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      codigoEspecializacion: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
  }
}

