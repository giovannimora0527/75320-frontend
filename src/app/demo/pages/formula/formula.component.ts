import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Formula } from './models/formula';
import { FormulaService } from './service/formula.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    // Angular Material
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent implements AfterViewInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula | null = null;

  form!: FormGroup;
  titleSpinner: string = '';

  // Angular Material Table
  displayedColumns: string[] = [
    'id',
    'citaId',
    'medicamentoId',
    'dosis',
    'indicaciones',
    'fechaCreacionRegistro',
    'acciones'
  ];
  dataSource = new MatTableDataSource<Formula>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formulaService: FormulaService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
    this.listarFormulas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarFormulario() {
    this.form = this.fb.group({
      id: [null],
      citaId: ['', Validators.required],
      medicamentoId: ['', Validators.required],
      dosis: ['', [Validators.required, Validators.minLength(3)]],
      indicaciones: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  listarFormulas() {
    this.titleSpinner = 'Cargando fórmulas...';
    this.spinner.show();

    this.formulaService.listarFormulas().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error al listar fórmulas:', err);
        this.spinner.hide();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarFormula() {
    if (this.form.valid) {
      Swal.fire({
        title: this.modoFormulario === 'C'
          ? '¿Desea crear esta fórmula?'
          : '¿Desea actualizar esta fórmula?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: this.modoFormulario === 'C' ? 'Sí, crear' : 'Sí, actualizar',
        denyButtonText: 'No guardar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.modoFormulario === 'C') {
            this.crearFormula();
          } else {
            this.actualizarFormula();
          }
        } else if (result.isDenied) {
          Swal.fire('Cambios no guardados', '', 'info');
        }
      });
    }
  }

  private crearFormula() {
    this.titleSpinner = 'Creando fórmula...';
    this.spinner.show();

    this.formulaService.guardarFormula(this.form.getRawValue()).subscribe({
      next: (data) => {
        this.spinner.hide();
        Swal.fire('Guardado', data[0]?.message || 'Fórmula creada exitosamente.', 'success');
        this.listarFormulas();
        this.closeModal();
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire('Error', err.error?.message || 'Ocurrió un error al crear la fórmula.', 'error');
      }
    });
  }

  actualizarFormula() {
    if (this.form.valid && this.formulaSelected) {
      this.titleSpinner = 'Actualizando fórmula...';
      this.spinner.show();

      const formulaActualizada: Formula = {
        ...this.formulaSelected,
        ...this.form.getRawValue()
      };

      this.formulaService.actualizarFormula(formulaActualizada).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Actualizado', data[0]?.message || 'Fórmula actualizada exitosamente.', 'success');
          this.listarFormulas();
          this.closeModal();
        },
        error: (err) => {
          this.spinner.hide();
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al actualizar la fórmula.', 'error');
        }
      });
    }
  }

  abrirNuevaFormula() {
    this.formulaSelected = new Formula();
    this.limpiarFormulario();
    this.openModal('C');
  }

  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.form.patchValue(formula);
    this.openModal('E');
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Fórmula' : 'Editar Fórmula';
    this.titleBoton = modo === 'C' ? 'Guardar Fórmula' : 'Actualizar Fórmula';
    this.modoFormulario = modo;

    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.form.reset({
      id: null,
      citaId: '',
      medicamentoId: '',
      dosis: '',
      indicaciones: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
