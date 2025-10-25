<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicamentoService } from './service/medicamento.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-medicamentos',
  standalone: true,  // ✅ IMPORTANTE
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule], // ✅ Importa aquí los módulos
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent implements OnInit {
  medicamentos: any[] = [];
  form!: FormGroup;
  editando = false;
  medicamentoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private medicamentoService: MedicamentoService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerMedicamentos();
  }

  crearFormulario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  obtenerMedicamentos() {
    this.medicamentoService.listar().subscribe({
      next: (data) => (this.medicamentos = data),
      error: (err) => console.error('Error al obtener medicamentos:', err)
=======
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Medicamento } from './models/medicamentos';
import { MedicamentoService } from './service/medicamento.service';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-medicamento',
  standalone: true,
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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } // ✅ calendario en español
  ]
})
export class MedicamentoComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  medicamento: Medicamento[] = [];
  dataSource = new MatTableDataSource<Medicamento>([]);
  displayedColumns: string[] = [
    'id', 'nombre', 'descripcion', 'presentacion', 'fechaCompra',
    'fechaVence', 'fechaCreacionRegistro', 'fechaModificacionRegistro', 'acciones'
  ];
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamento | null = null;
  titleSpinner: string = "";

  form!: FormGroup;

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
    this.listarMedicamento();
    this.titleSpinner = "Cargando inventario de medicamentos...";
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 2000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Filtro personalizado
    this.dataSource.filterPredicate = (data: Medicamento, filter: string) => {
      const searchString = filter.toLowerCase();
      return (
        data.id?.toString().includes(searchString) ||
        data.nombre?.toLowerCase().includes(searchString) ||
        data.descripcion?.toLowerCase().includes(searchString) ||
        data.presentacion?.toLowerCase().includes(searchString) ||
        data.fechaCompra?.toString().includes(searchString) ||
        data.fechaVence?.toString().includes(searchString) ||
        data.fechaCreacionRegistro?.toString().includes(searchString) ||
        data.fechaModificacionRegistro?.toString().includes(searchString) 
            );
    };
  }

cargarFormulario() {
  this.form = this.formBuilder.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    presentacion: ['', Validators.required],
    fechaCompra: [null, Validators.required],
    fechaVence: [null, Validators.required],
  });
}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarMedicamento() {
    this.medicamentoService.listarMedicamento().subscribe({
      next: (data) => {
        this.medicamento = data;
        this.dataSource.data = data;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al listar medicamentos:', err);
        Swal.fire('Error', 'Ocurrió un error al cargar los medicamentos.', 'error');
      }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
    });
  }

  guardarMedicamento() {
<<<<<<< HEAD
    if (this.form.invalid) return;

    if (this.editando && this.medicamentoSeleccionado) {
      this.medicamentoService
        .actualizar(this.medicamentoSeleccionado.id, this.form.value)
        .subscribe({
          next: () => {
            alert('✅ Medicamento actualizado correctamente');
            this.obtenerMedicamentos();
            this.cancelarEdicion();
          },
          error: (err) => console.error('Error al actualizar medicamento:', err)
        });
    } else {
      this.medicamentoService.crear(this.form.value).subscribe({
        next: () => {
          alert('💊 Medicamento creado correctamente');
          this.obtenerMedicamentos();
          this.form.reset();
        },
        error: (err) => console.error('Error al crear medicamento:', err)
=======
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      // Crear medicamento sin fecha de modificación
      const nuevoMedicamento = { ...this.form.getRawValue(), fechaModificacionRegistro: null };

      this.medicamentoService.guardarMedicamento(nuevoMedicamento).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.message, 'success');
          this.listarMedicamento();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear medicamento:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
      });
    } else if (this.modoFormulario === 'E' && this.medicamentoSelected) {
      // Editar medicamento con fecha actual
      const medicamentoActualizado = {
        ...this.medicamentoSelected,
        ...this.form.getRawValue(),
        fechaModificacionRegistro: new Date().toISOString()
      };

      this.medicamentoService.actualizarMedicamento(medicamentoActualizado).subscribe({
        next: (data) => {
          Swal.fire('Éxito', data.message, 'success');
          this.listarMedicamento();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar medicamento:', error);
          Swal.fire('Error', error.error.message, 'error');
        }
>>>>>>> 054efa9 (Primer commit - subiendo proyecto a mi rama 976621_Mariana Castillo Segundo corte)
      });
    }
  }

<<<<<<< HEAD
  editarMedicamento(medicamento: any) {
    this.editando = true;
    this.medicamentoSeleccionado = medicamento;
    this.form.patchValue(medicamento);
  }

  eliminarMedicamento(id: number) {
    if (confirm('¿Deseas eliminar este medicamento?')) {
      this.medicamentoService.eliminar(id).subscribe({
        next: () => {
          alert('🗑️ Medicamento eliminado');
          this.obtenerMedicamentos();
        },
        error: (err) => console.error('Error al eliminar medicamento:', err)
      });
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.medicamentoSeleccionado = null;
    this.form.reset();
=======
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear medicamento' : 'Editar medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar medicamento' : 'Actualizar medicamento';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedicamento() {
    this.medicamentoSelected = null;
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      fechaCompra: medicamento.fechaCompra ? new Date(medicamento.fechaCompra) : null,
      fechaVence: medicamento.fechaVence ? new Date(medicamento.fechaVence) : null
    });
    this.openModal('E');
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      presentacion: '',
      fechaCompra: null,
      fechaVence: null
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





