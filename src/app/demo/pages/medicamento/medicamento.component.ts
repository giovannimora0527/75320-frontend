import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { CommonModule } from '@angular/common';
import { Medicamentos } from './model/medicamento';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators // Importa Validators
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

@Component({
  selector: 'app-medicamento',
  // Asegúrate que tu componente sea standalone si usas 'imports' aquí
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
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicamentoSelected: Medicamentos;
  titleSpinner: string = "";

  dataSource = new MatTableDataSource<Medicamentos>([]);
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'presentacion', 'acciones'];
  // Ya no necesitamos 'medicamentosList', MatTableDataSource se encarga de todo
  // medicamentosList: Medicamentos[] = []; 

  form: FormGroup; // No es necesario inicializarlo aquí si lo haces en el método

  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly utilService: UtilService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    // Inicializa el formulario aquí
    this.inicializarFormulario();
  }

  ngOnInit() {
    // Llama a listarMedicamentos en ngOnInit
    this.listarMedicamentos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Medicamentos, filter: string) => {
      const searchString = filter.toLowerCase().trim();
      return data.nombre?.toLowerCase().includes(searchString) ||
        data.descripcion?.toLowerCase().includes(searchString) ||
        data.presentacion?.toLowerCase().includes(searchString) ||
        data.id?.toString().includes(searchString);
    };
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      // Agrega Validators para que el .html funcione
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      presentacion: ['', [Validators.required]],
      fechaCompra: ['', [Validators.required]],
    });
  }

  listarMedicamentos() {
    console.log('Entro a cargar Medicamentos');
    this.titleSpinner = "Cargando medicamentos...";
    this.spinner.show(); // <-- MUESTRA EL SPINNER AQUÍ

    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        // Asigna los datos directamente al dataSource
        this.dataSource.data = data;
        console.log('Medicamentos cargados:', data);
        setTimeout(() => {
          this.spinner.hide();
        }, 2000); // <-- OCULTA EL SPINNER AQUÍ
      },
      error: (err) => {
        console.error('Error al listar Medicamentos:', err);
        this.spinner.hide(); // <-- OCULTA EL SPINNER TAMBIÉN EN CASO DE ERROR
        Swal.fire('Error', 'No se pudieron cargar los medicamentos.', 'error');
      }
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
    this.titleModal = modo === 'C' ? 'Crear Medicamentos' : 'Editar Medicamentos';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamentos' : 'Actualizar Medicamentos';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedicamento() {
    this.limpiarFormulario(); // Limpia el formulario
    this.medicamentoSelected = new Medicamentos();
    this.openModal('C');
  }

  abrirEditarMedicamento(medicamento: Medicamentos) {
    this.limpiarFormulario();
    this.medicamentoSelected = medicamento;
    // Setea los valores en el formulario reactivo
    this.form.setValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      fechaCompra: this.utilService.formatDateToInput(medicamento.fechaCompra),
    });
    this.openModal('E');
  }

  limpiarFormulario() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      presentacion: '',
      fechaCompra: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  guardarMedicamento() {
    // Marca todos los campos como 'touched' para mostrar errores si están vacíos
    this.form.markAllAsTouched();

    console.log('Valor de fechaCompra:', this.form.value.fechaCompra);

    if (this.form.valid) {
      this.titleSpinner = this.modoFormulario === 'C' ? "Creando Medicamento..." : "Actualizando Medicamento...";
      this.spinner.show();

      if (this.modoFormulario.includes('C')) {
      
      const medicamentoData = this.form.getRawValue();
      medicamentoData.fechaCompra = this.utilService.convertToIsoDate(medicamentoData.fechaCompra);

        // Modo Creación
        this.medicamentoService.guardarMedicamento(medicamentoData).subscribe({
          next: (data) => {
            this.spinner.hide();
            console.log('medicamento guardado:', data);
            Swal.fire('Creación exitosa', data.message || 'Medicamento creado.', 'success');
            this.listarMedicamentos(); // Recarga la lista
            this.closeModal();
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al guardar el medicamento:', err);
            Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear el Medicamento.', 'error');
          }
        });
      } else {
        // Modo Edición
        const actualizarMedicamento = { ...this.medicamentoSelected, ...this.form.getRawValue() };
        this.medicamentoService.actualizarMedicamento(actualizarMedicamento)
          .subscribe({
            next: (data) => {
              this.spinner.hide();
              Swal.fire('Actualización exitosa', data.message || 'Medicamento actualizado.', 'success');
              this.listarMedicamentos(); // Recarga la lista
              this.closeModal();
            },
            error: (error) => {
              this.spinner.hide();
              console.error('Error al actualizar el Medicamento:', error);
              Swal.fire('Error', error.error?.message || 'Ocurrió un error al actualizar el Medicamento.', 'error');
            }
          }
          );
      }
    } else {
      // El formulario no es válido, no hagas nada (los mensajes de error se mostrarán)
      console.log("Formulario inválido");
    }
  }
}

