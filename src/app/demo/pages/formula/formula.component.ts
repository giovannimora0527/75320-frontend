import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Receta } from './models/receta';
import { RecetaService } from './service/receta.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { UtilService } from 'src/app/services/common/util.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule
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
import { Medicamento } from './models/medicamento';
import { Cita } from './models/cita';

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
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})

export class FormulaComponent implements AfterViewInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
    modoFormulario: string = '';
    receta: Receta[] = [];
    dataSource = new MatTableDataSource<Receta>([]);
    displayedColumns: string[] = ['id','citaPaciente', 'citaMedico', 'medicamento', 'dosis', 'indicaciones', 'fechaCreacionRegistro', 'acciones'];
    titleModal: string = '';
    titleBoton: string = '';
    recetaSelected: Receta;
    titleSpinner: string = "";
    medicamentoList: Medicamento[] = [];
    citaList: Cita[] = [];
  
    form: FormGroup = new FormGroup({
      cita: new FormControl('', Validators.required),
      medicamento: new FormControl('', Validators.required),
      dosis: new FormControl('', Validators.required),
      indicaciones: new FormControl('', Validators.required),
    });
  
    constructor(
      private readonly recetaService: RecetaService,
      private readonly formBuilder: FormBuilder,
      private readonly spinner: NgxSpinnerService,
      private readonly utilService: UtilService
    ) {
      this.listarRecetas();
      this.listarMedicamentos();
      this.listarCitas();
      this.cargarFormulario();
      this.titleSpinner = "Cargando Formulas Medicas...";
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    }
    
    listarMedicamentos() {
      this.utilService.listarMedicamentos().subscribe({
        next: (data) => {
          console.log(data);
          this.medicamentoList = data;
        },
        error: (error) => {
          console.error('Error fetching medicamento:', error);
        }
      });
    }

    listarCitas() {
      this.utilService.listarCitas().subscribe({
        next: (data) => {
          console.log(data);
          this.citaList = data;
        },
        error: (error) => {
          console.error('Error fetching cita:', error);
        }
      });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Configurar filtro personalizado
        this.dataSource.filterPredicate = (data: Receta, filter: string) => {
          const searchString = filter.toLowerCase();
          return data.id?.toString().includes(searchString) ||
                 data.cita?.toString().includes(searchString) ||
                 data.medicamento?.toString().includes(searchString) ||
                 data.dosis?.toLowerCase().includes(searchString) ||
                 data.indicaciones?.toLowerCase().includes(searchString) ||
                 data.fechaCreacionRegistro?.toString().includes(searchString);
        };
      }

    cargarFormulario() {
      this.form = this.formBuilder.group({
        cita: ['', [Validators.required]],
        medicamento: ['', [Validators.required]],
        dosis: ['', [Validators.required]],
        indicaciones: ['', [Validators.required]],
      });
    }
  
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
  
    listarRecetas() {
      this.recetaService.listarRecetas().subscribe({
        next: (data) => {
          console.log(data);
          this.receta = data;
          this.dataSource.data = data;
        },

        error: (err) => {
          this.spinner.hide();
          console.error('Error al listar recetas:', err);
          Swal.fire('Error', 'Ocurrió un error al cargar las recetas.', 'error');
        }
      });
    }
  
  
    guardarReceta() {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          Swal.fire('Error', 'Por favor, complete todos los campos obligatorios.', 'error');
          return;
        }
    
        if (this.modoFormulario === 'C') {
          // Crear receta
          this.recetaService.guardarReceta(this.form.getRawValue()).subscribe({
            next: (data) => {          
              Swal.fire('Éxito', data.message, 'success');
              this.listarRecetas();
              this.closeModal();
            },
            error: (error) => {
              console.error('Error creating receta:', error);
              Swal.fire("Error", error.error.message, "error");
            }
          });
        } else {
          // Editar receta
          const recetaActualizada = { ...this.recetaSelected, ...this.form.getRawValue() };      
          this.recetaService.actualizarReceta(recetaActualizada).subscribe({
            next: (data) => { 
              Swal.fire('Éxito', data.message, 'success');
              this.listarRecetas();
              this.closeModal();
            },
            error: (error) => {
              console.error('Error updating receta:', error);
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
      this.recetaSelected = new Receta();
      this.limpiarFormulario();
      // Dejamos el formulario en blanco
      this.openModal('C');
    }
  
    abrirEditarReceta(receta: Receta) {
      this.limpiarFormulario();
      this.recetaSelected = receta;
      this.form.get("cita").setValue(this.recetaSelected.cita);
      this.form.get("medicamento").setValue(this.recetaSelected.medicamento);
      this.form.get("dosis").setValue(this.recetaSelected.dosis);
      this.form.get("indicaciones").setValue(this.recetaSelected.indicaciones);
      this.openModal('E');
    }

    limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      cita: '',
      medicamento: '',
      dosis: '',
      indicaciones: ''
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
