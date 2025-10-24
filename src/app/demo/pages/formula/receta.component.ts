import { Component, ViewChild, AfterViewInit} from '@angular/core';
import { RecetaService } from './service/receta.service';
import { CommonModule } from '@angular/common';
import { Receta } from './model/recetas';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { UtilService } from 'src/app/services/common/util.service';
import { Medicamentos } from '../medicamento/model/medicamento';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { Cita } from '../cita/model/cita';
import { CitaService } from '../cita/service/cita.service';


@Component({
  selector: 'app-formula',
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
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.scss'
})
export class FormulaComponent implements AfterViewInit{

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    modalInstance: Modal | null = null;
    modoFormulario: string = '';
    titleModal: string = '';
    titleBoton: string = '';
    recetaSelected: Receta;
    titleSpinner: string = "";
  
    dataSource = new MatTableDataSource<Receta>([]);
    dSource = new MatTableDataSource<Medicamentos>([]);
    daSource = new MatTableDataSource<Cita>([]);
    displayedColumns: string[] = ['id', 'citaid', 'medicamentoid', 'dosis', 'indicaciones', 'acciones'];
    recetasList: Receta[] = [];
    medicamentosList: Medicamentos[] = [];
    citaList: Cita[] = [];
  
    form: FormGroup = new FormGroup({
      id: new FormControl(''),
      citaId: new FormControl(''),
      medicamentoId: new FormControl(''),
      dosis: new FormControl(''),
      indicaciones: new FormControl(''),
    });

    constructor(
        private readonly recetaService: RecetaService,
        private readonly medicamentoService: MedicamentoService,
        private readonly citaService: CitaService,
        private readonly utilService: UtilService,
        private readonly formBuilder: FormBuilder,
        private readonly spinner: NgxSpinnerService
      ) {
        this.listarRecetas();
        this.listarMedicamentos();
        this.listarCitas();
        this.inicializarFormulario();
      }


    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Configurar filtro personalizado
      this.dataSource.filterPredicate = (data: Receta, filter: string) => {
        const searchString = filter.toLowerCase();
        return data.id?.toString().includes(searchString) ||
              data.medicamento?.toString().includes(searchString) ||
              data.dosis?.toLowerCase().includes(searchString) ||
              data.indicaciones?.toLowerCase().includes(searchString) ||
              data.id?.toString().includes(searchString);
            
      };
    }

  listarMedicamentos() {
    console.log('Entro a cargar Recetas');
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.medicamentosList= data;
        console.log('Recetas cargados:', this.medicamentosList);
        this.dSource.data = this.medicamentosList;
      },
      error: (err) => console.error('Error al listar Recetas:', err)
    });
  }

    inicializarFormulario() {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      citaId: ['', [Validators.required]],
      medicamentoId: ['', [Validators.required]],
      dosis: ['', [Validators.required]],
      indicaciones: [''],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarCitas() {
    console.log('Entro a cargar Recetas');
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        this.citaList= data;
        console.log('Recetas cargados:', this.citaList);
        this.daSource.data = this.citaList;
      },
      error: (err) => console.error('Error al listar Recetas:', err)
    });
  }

    listarRecetas() {
    console.log('Entro a cargar Recetas');
    this.titleSpinner = "Cargando recetas...";
    this.spinner.show();

    this.recetaService.listarRecetas().subscribe({
      next: (data) => {
        this.recetasList= data;
        console.log('Recetas cargados:', this.recetasList);
        this.dataSource.data = this.recetasList;
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
      error: (err) => console.error('Error al listar Recetas:', err)
    });
  }

  // Agrega el método para aplicar el filtro (necesario para el nuevo HTML)
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
    this.limpiarFormulario(); // <-- AÑADE ESTA LÍNEA
    this.recetaSelected = new Receta();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarReceta(receta: Receta) {
    this.form.patchValue({
      id: receta.id,
      citaId: receta.cita,
      medicamentoId: receta.medicamento,
      dosis: receta.dosis,
      indicaciones: receta.indicaciones
    });
    
    this.openModal('E');
  }

      limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      Id: '',
      citaId: '',
      medicamentoId: '',
      dosis: '',
      indicaciones: '',
    });
  }

  guardarReceta() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }
        
    if (this.modoFormulario === 'C') {
      // Crear Receta
      this.recetaService.guardarReceta(this.form.getRawValue()).subscribe({
      next: (data) => {          
        Swal.fire('Éxito', data.message, 'success');
        this.listarRecetas();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al crear receta:', error);
        Swal.fire("Error", error.error.message, "error");
      }
    });
      } else {
      // Editar Receta
      const recetaActualizado = { ...this.recetaSelected, ...this.form.getRawValue() };      
      this.recetaService.actualizarReceta(recetaActualizado).subscribe({
      next: (data) => { 
        Swal.fire('Éxito', data.message, 'success');
        this.listarRecetas();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al actualizar receta:', error);
        Swal.fire("Error", error.error.message, "error");
                }
              });
            }
          }
}