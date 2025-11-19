import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import library module
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';
import { Formula } from './models/formula';
import { FormulaService } from './service/formula.service';
import { PacienteService } from '../paciente/service/paciente.service';
import { Paciente } from '../paciente/model/paciente';
import { CitaService } from '../cita/service/cita.service';
import { Cita } from '../cita/model/cita';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, NgxSpinnerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent {
  mostrarPassword: boolean = false;
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  titleSpinner: string = 'Cargando...';
  busqueda: string = '';

  documentoPacienteBuscar: string = "";
  pacienteEncontrado: Paciente;

  formulaList: Formula[] = [];
  formulaFiltered: Formula[] = [];
  citasPaciente: Cita[] = [];

  // Contador de caracteres para indicaciones
  contadorIndicaciones: number = 0;
  maxCaracteresIndicaciones: number = 500;

  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly pacienteService: PacienteService,
    private readonly citaService: CitaService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.listarFormulas();    
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      citaId: ['', [Validators.required]],
      medicamentoId: ['', [Validators.required]],
      dosis: ['', [Validators.required]],
      indicaciones: ['', [Validators.required, Validators.maxLength(this.maxCaracteresIndicaciones)]]
    });

    // Suscripción a los cambios del campo indicaciones para actualizar el contador
    this.form.get('indicaciones')?.valueChanges.subscribe((valor: string) => {
      this.contadorIndicaciones = valor ? valor.length : 0;
    });
  }

  listarFormulas() {
    this.spinner.show();
    this.formulaService.listarFormulas().subscribe({
      next: (data) => {
        this.formulaList = data;
        this.formulaFiltered = this.formulaList;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        Swal.fire('Error', error.error.mesage, 'error');
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.limpiarFormulario();
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Formula' : 'Editar Formula';
    this.titleBoton = modo === 'C' ? 'Guardar Formula' : 'Actualizar Formula';
    this.modoFormulario = modo;
    
    // Si es modo crear, limpiar el formulario y resetear contador
    if (modo === 'C') {
      this.limpiarFormulario();
    }
    
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoFormula() {
    this.formulaSelected = null;
    this.contadorIndicaciones = 0; // Resetear contador para nuevo formulario
    this.openModal('C');
  }

  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    // Actualizar contador con la longitud de las indicaciones existentes
    this.contadorIndicaciones = formula.indicaciones ? formula.indicaciones.length : 0;
    this.openModal('E');
    
    // Cargar los datos en el formulario
    this.form.patchValue({
      citaId: formula.cita?.id || '',
      medicamentoId: formula.medicamento?.id || '',
      dosis: formula.dosis || '',
      indicaciones: formula.indicaciones || ''
    });
  }

  limpiarFormulario() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset();
    this.contadorIndicaciones = 0;
  }

  filtrarFormula() {
    if (this.busqueda === '') {
      this.formulaFiltered = this.formulaList;
      return;
    }
    this.formulaFiltered = this.formulaList.filter((formula) => {
      const busquedaLower = this.busqueda.toLowerCase();

      // Filtrar por dosis
      const dosisCumple = formula.dosis && formula.dosis.toLowerCase().includes(busquedaLower);

      // Filtrar por indicaciones
      const indicacionesCumple = formula.indicaciones && formula.indicaciones.toLowerCase().includes(busquedaLower);

      // Filtrar por número de documento del paciente
      const numeroDocumentoCumple =
        formula.cita?.paciente?.numeroDocumento && formula.cita.paciente.numeroDocumento.toLowerCase().includes(busquedaLower);

      // Filtrar por nombres del paciente
      const nombresCumple = formula.cita?.paciente?.nombres && formula.cita.paciente.nombres.toLowerCase().includes(busquedaLower);

      // Filtrar por apellidos del paciente
      const apellidosCumple = formula.cita?.paciente?.apellidos && formula.cita.paciente.apellidos.toLowerCase().includes(busquedaLower);

      // Filtrar por fecha (fechaHora puede ser Date o string) — normalizar a string
      const fechaStr: string = formula.cita?.fechaHora
        ? (formula.cita.fechaHora instanceof Date
            ? formula.cita.fechaHora.toLocaleString()
            : String(formula.cita.fechaHora))
        : '';
      const fechasCumple = fechaStr.toLowerCase().includes(busquedaLower);

      // Retorna true si cualquiera de los criterios se cumple
      return dosisCumple || indicacionesCumple || numeroDocumentoCumple || nombresCumple || apellidosCumple || fechasCumple;
    });
  }

  buscarPacientePorDocumento() {
    this.pacienteService.buscarPacientePorDocumento(this.documentoPacienteBuscar).subscribe({
      next: (data) => {
        console.log('Paciente encontrado:', data);
        this.pacienteEncontrado = data;
        // Coloco la logica para conocer las citas por paciente
        this.citaService.buscarCitaPorPacienteId(this.pacienteEncontrado.id).subscribe({
          next: (data) => {
            console.log('Citas del paciente:', data);
            this.citasPaciente = data;
            Swal.fire("Citas cargadas correctamente","Citas del paciente encontradas", "success");
          },
          error: (error) => {
            console.error('Error al buscar citas del paciente:', error);
            Swal.fire('Error', error.error.message, 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error al buscar paciente:', error);
        Swal.fire('Error', error.error.message, 'error');
      }
    });
  }

  // Método para actualizar el contador de caracteres de indicaciones
  onIndicacionesChange(event: Event) {
    // Usar setTimeout para asegurar que el valor se actualice después de eventos como paste
    setTimeout(() => {
      const target = event.target as HTMLTextAreaElement;
      const valor = target.value;
      this.contadorIndicaciones = valor.length;
    }, 0);
  }

  guardarFormula() {}
}
