import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { RecetaService } from './service/receta.service';
import { CommonModule } from '@angular/common';
import { Recetas } from './model/recetas';
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

import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

import { UtilService } from 'src/app/services/common/util.service';
//import { Medicamentos } from './models/medicamentos';
//import { Cita } from './models/cita';

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
    recetaSelected: Recetas;
    titleSpinner: string = "";
  
    dataSource = new MatTableDataSource<Recetas>([]);
    displayedColumns: string[] = ['id', 'medicamentoid', 'dosis', 'indicaciones', 'acciones'];
    recetasList: Recetas[] = [];
    //medicamentosList: Medicamentos[] = [];
    //citaList: Cita[] = [];
  
    form: FormGroup = new FormGroup({
      citaid: new FormControl(''),
      medicamentoid: new FormControl(''),
      dosis: new FormControl(''),
      indicaciones: new FormControl(''),
    });

    constructor(
        private readonly recetaService: RecetaService,
        private readonly utilService: UtilService,
        private readonly formBuilder: FormBuilder,
        private readonly spinner: NgxSpinnerService
      ) {
        this.listarRecetas();
        //this.listarMedicamentos();
        //this.listarCitas();
        this.inicializarFormulario();
        this.titleSpinner = "Prueba spinner";
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
    
      }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Configurar filtro personalizado
      this.dataSource.filterPredicate = (data: Recetas, filter: string) => {
        const searchString = filter.toLowerCase();
        return data.medicamentoid?.toString().includes(searchString) ||
              data.dosis?.toLowerCase().includes(searchString) ||
              data.indicaciones?.toLowerCase().includes(searchString) ||
              data.id?.toString().includes(searchString);
            
      };
    }

  /*listarMedicamentos() {
    this.utilService.listarMedicamentos().subscribe({
      next: (data) => {
        console.log(data);
        this.listarMedicamentos = data;
      },
      error: (error) => {
        console.error('Error fetching especializaciones:', error);
      }
    });
  }*/

    inicializarFormulario() {
    this.form = this.formBuilder.group({
      citaid: [''],
      medicamentoid: [''],
      dosis: [''],
      indicaciones: [''],
    });
  }

  listarRecetas() {
    console.log('Entro a cargar Recetas');
    this.recetaService.listarRecetas().subscribe({
      next: (data) => {
        this.recetasList= data;
        console.log('Recetas cargados:', this.recetasList);
        this.dataSource.data = this.recetasList;
      },
      error: (err) => console.error('Error al listar Recetas:', err)
    });
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
    this.recetaSelected = new Recetas();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarReceta(receta: Recetas) {
      this.limpiarFormulario();
      this.recetaSelected = receta;
      this.form.get("citaid").setValue(this.recetaSelected.citaid);
      this.form.get("medicamentoid").setValue(this.recetaSelected.medicamentoid);
      this.form.get("dosis").setValue(this.recetaSelected.dosis);
      this.form.get("indicaciones").setValue(this.recetaSelected.indicaciones);
    this.openModal('E');
  }

      limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      citaid: '',
      medicamentoid: '',
      dosis: '',
      indicaciones: '',
    });
  }

  guardarReceta() {
        this.titleSpinner = this.modoFormulario === 'C' ? "Creando receta..." : "Actualizando receta...";
        this.spinner.show();
        if (this.form.valid) {
          if (this.modoFormulario.includes('C')) {
            // Modo Creación
            this.recetaService.guardarReceta(this.form.getRawValue()).subscribe({
              next: (data) => {
                this.spinner.hide();
                console.log('receta guardada:', data);
                Swal.fire('Creación exitosa', data.message, 'success');
                this.listarRecetas();
                this.closeModal();
              },
              error: (err) => {
                this.spinner.hide();
                console.error('Error al guardar receta:', err);
                Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el receta.', 'error');
              }
            });
          } else {
            // Modo Edición
            const recetaActualizada = { ...this.recetaSelected, ...this.form.getRawValue() };
            console.log(recetaActualizada);
            this.recetaService.actualizarReceta(recetaActualizada)
            .subscribe(
              {
                next: (data) => {    
                  this.spinner.hide();         
                  Swal.fire('Actualización exitosa', data.message, 'success');
                  this.listarRecetas();
                  this.closeModal();
                },
                error: (error) => {
                  this.spinner.hide();
                  console.error('Error al actualizar receta:', error);
                  Swal.fire('Error', error.error?.message || 'Ocurrió un error al actualizar el receta.', 'error');
                } 
              }
            );
            
          }
        } else {
          this.spinner.hide();
        }
      }
}
