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
  selector: 'app-especializacion',
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
    MatTooltipModule
  ],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent  implements AfterViewInit {
  Especializacionselected: { id: number; nombre: string; descripcion: string; codigoEspecializacion: string; };
abrirEditarEspecializacion(_t85: any) {
throw new Error('Method not implemented.');
}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  especializacion: Especializacion[] = [];
  dataSource = new MatTableDataSource<Especializacion>([]);
  displayedColumns: string[] = [
    'id',
    'nombre', 
    'descripcion',
    'codigoEspecializacion', 
    'acciones'
  ];

  titleModal: string = '';
  tittlebotton: string = '';
  especializacionselected:Especializacion;

  titleSpinner: string = 'Cargando especializaciones...';

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    codigoEspecializacion: new FormControl(''),
  });

  constructor(
    private readonly especializacionService: EspecializacionService,
    private  readonly formBuilder: FormBuilder,
    private readonly spinner : NgxSpinnerService
  ){
    this.listarEsPecializaciones();
    this.cargarFormulario();
    this.titleSpinner = "prueba spinner";
     this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
    
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 


    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Especializacion, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return (
        data.nombre ?.toLowerCase().includes(searchString) ||
        data.descripcion ?.toLowerCase().includes(searchString) ||
        data.codigoEspecializacion ?.toLowerCase().includes(searchString) ||
        data.id?.toString() ?.includes(searchString)
      );
      
    };
}

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(250)]],
      codigoEspecializacion: ['',Validators.required]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  /**
   * Servicio para listar las especializaciones
   */
    listarEsPecializaciones() {
    this.titleSpinner = 'Cargando especializaciones...';
    this.spinner.show();
    console.log('Entrando a listar especializaciones');
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacion = data;
        this.dataSource.data =data;
        this.spinner.hide();
        console.log('Especializaciones cargadas:', this.especializacion);
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error al cargar las especializaciones:', error);
        Swal.fire('Error', 'Ocurrió un error al cargar las especializaciones.', 'error');
      }
    });
  }
  /**
   * Servicio para Guardar las especializaciones
   */

  guardarEspecializacion() {
    this.titleSpinner = this.modoFormulario === 'C'? "Creando especialización...": "Actualizando especialización...";
    this.spinner.show();

    if (this.form.valid) {
          if (this.modoFormulario.includes('C')) {
            this.especializacionService.guardarEspecializacion(this.form.getRawValue()).subscribe({
              next: (data) => {
                this.spinner.hide();
                console.log('Especializacion guardada:', data);
                Swal.fire('Creación exitosa', data.message, 'success');
                this.listarEsPecializaciones();
                this.closeModal();
              },
              error: (err) => {
                this.spinner.hide();
                console.error('Error al guardar la Especializacion:', err);
                Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear la especializacion.', 'error');
              }
            });
          }else {
                  const especializacionActualizada = { ...this.especializacionselected, ...this.form.getRawValue() };
                  this.especializacionService.actualizarEspecializacion(especializacionActualizada).subscribe({
                    next: (data) => {
                      this.spinner.hide();
                      Swal.fire('Actualización exitosa', data.message, 'success');
                      this.listarEsPecializaciones();
                      this.closeModal();
                    },
                    error: (error) => {
                      this.spinner.hide();
                      console.error('Error al actualizar la especializacion:', error);
                      Swal.fire('Error', error.error?.message || 'Ocurrió un error al actualizar la especialziacion.', 'error');
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
    this.titleModal = modo === 'C' ? 'Crear Especialización' : 'Editar Especialización';
    this.tittlebotton = modo === 'C' ? 'Guardar Especialización' : 'Actualizar Especialización';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearEspecializacion');
    if (modalElement) {

      //Verificar si la instancia del modal ya existe
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevaEspecializacion(){
    this.Especializacionselected = {
      id:0,
      nombre:'',
      descripcion:'',
      codigoEspecializacion:'',

    };
    this.limpiarFormulario();
    this.openModal('C');
  }


  abrirEdicionEspecializacion(especializacion: Especializacion) {
  this.limpiarFormulario();
  this.especializacionselected = {
    ...especializacion,
    codigoEspecializacion: (especializacion as any).codigEspecializacion ?? (especializacion as any).codigoEspecializacion ?? ''
  } as Especializacion;
  this.form.patchValue(this.especializacionselected);
  this.openModal('E');
}
  
  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({ 
    id:'',
    nombre:'',
    descripcion:'',
    codigoEspecializacion:''
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
