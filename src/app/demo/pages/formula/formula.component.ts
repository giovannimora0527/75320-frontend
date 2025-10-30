import { Component } from '@angular/core';
import { FormulaService } from './service/formula.service';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

//import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

import { FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Formula } from './models/formula';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  titleSpinner: string = '';
  formulaList: Formula[] = [];
  formulaListFiltered: Formula[] = [];
  busqueda: string = '';

  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.listarRecetas();
  }

  listarRecetas() {
    this.titleSpinner = 'Cargando recetas...';
    this.spinner.show();
    this.formulaService.listarFormulas().subscribe({
      next: (formulas: Formula[]) => {
        console.log(formulas);
        this.formulaList = formulas;
        this.formulaListFiltered = this.formulaList;
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar las recetas:', err);
      }
    });
  }

  inicializarFormulario() {
    this.form = new FormGroup({
      citaId: new FormControl('', [Validators.required]),
      medicamentoId: new FormControl('', [Validators.required]),
      dosis: new FormControl('', [Validators.required]),
      indicaciones: new FormControl('', [Validators.required])
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.limpiarFormulario();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Formula' : 'Editar Formula';
    this.titleBoton = modo === 'C' ? 'Guardar Formula' : 'Actualizar Formula';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset();
  }

  abrirNuevoFormula() {
    this.formulaSelected = new Formula();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.openModal('E');
  }

  filtrarFormulas() {
    if (this.busqueda.trim() === '') {
      this.formulaListFiltered = this.formulaList;
    }

    this.formulaListFiltered = this.formulaList.filter((formula) => {
      const busquedaLower = this.busqueda.toLowerCase();
      const dosisCumple = formula.dosis && formula
      .dosis.toLowerCase().includes(busquedaLower);

      const indicacionesCumple = formula.indicaciones 
      && formula.indicaciones.toLowerCase().includes(busquedaLower);

      const medicamentoCumple = formula.medicamento.nombre 
      && formula.medicamento.nombre.toLowerCase().includes(busquedaLower);

      const presentacionCumple = formula.medicamento.presentacion 
      && formula.medicamento.presentacion.toLowerCase().includes(busquedaLower);

      const nombresCumple = formula.cita.paciente.nombres 
      && formula.cita.paciente.nombres.toLowerCase().includes(busquedaLower);

      const apellidosCumple = formula.cita.paciente.apellidos 
      && formula.cita.paciente.apellidos.toLowerCase().includes(busquedaLower);

      const fechaCitaCumple = formula.cita.fechaHora 
      && formula.cita.fechaHora.toString().includes(busquedaLower);

      const documentoCumple = formula.cita.paciente.numeroDocumento 
      && formula.cita?.paciente?.numeroDocumento.includes(busquedaLower);

      return dosisCumple || indicacionesCumple || presentacionCumple 
      || nombresCumple || apellidosCumple || fechaCitaCumple || documentoCumple || medicamentoCumple;
    });
  }
}
