import { Component } from '@angular/core';
import { FormulaService } from './service/formula.service';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

import { FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Formula } from './models/formula';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { Medicamento } from '../medicamento/models/medicamento';
import { Cita } from '../cita/model/cita';
import { PacienteService } from '../paciente/service/paciente.service';
import { CitaService } from '../cita/service/cita.service';

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
  formulaSelected: Formula = new Formula();
  titleSpinner: string = '';
  formulaList: Formula[] = [];
  formulaListFiltered: Formula[] = [];
  medicamentoList: Medicamento[] = [];
  busqueda: string = '';
  documentoPaciente: string = '';
  indicaciones: string = '';
  contadorCaracteres: number = 0;
  readonly LIMITE_CARACTERES = 500;

  citaSelected: Cita;
  citasList: Cita[] = [];

  form: FormGroup;

  constructor(
    private readonly formulaService: FormulaService,
    private readonly medicamentoService: MedicamentoService,
    private readonly pacienteService: PacienteService,
    private readonly citaService: CitaService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.inicializarFormulario();
    this.listarRecetas();
    this.listarMedicamentos();
  }

  listarRecetas() {
    this.titleSpinner = 'Cargando recetas...';
    this.spinner.show();
    this.formulaService.listarFormulas().subscribe({
      next: (formulas: Formula[]) => {
        console.log('Fórmulas cargadas:', formulas);
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

  /**
   * Método para listar todos los medicamentos disponibles
   */
  listarMedicamentos() {
    console.log('Iniciando carga de medicamentos...');

    this.medicamentoService.listarMedicamentos().subscribe({
      next: (medicamentos: Medicamento[]) => {
        console.log('Medicamentos recibidos del servicio:', medicamentos);
        this.medicamentoList = medicamentos;
      },
      error: (err) => {
        console.error('❌ Error al cargar los medicamentos:', err);
        this.medicamentoList = [];
      },
      complete: () => {
        console.log('🏁 Proceso de carga de medicamentos completado');
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
    this.inicializarContador('');
  }

  abrirNuevoFormula() {
    this.formulaSelected = new Formula();
    this.limpiarFormulario();
    // Dejamos el formulario en blanco
    this.openModal('C');
  }

  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.documentoPaciente = formula.cita.paciente.numeroDocumento || '';
    this.buscarPaciente();
    // Cargar datos en el formulario
    this.form.patchValue({
      citaId: this.citaSelected?.id || '',
      medicamentoId: formula.medicamento?.id || '',
      dosis: formula.dosis || '',
      indicaciones: formula.indicaciones || ''
    });

    // Inicializar contador con las indicaciones existentes
    this.inicializarContador(formula.indicaciones || '');

    this.openModal('E');
  }

  filtrarFormulas() {
    if (this.busqueda.trim() === '') {
      this.formulaListFiltered = this.formulaList;
    }

    this.formulaListFiltered = this.formulaList.filter((formula) => {
      const busquedaLower = this.busqueda.toLowerCase();
      const dosisCumple = formula.dosis && formula.dosis.toLowerCase().includes(busquedaLower);

      const indicacionesCumple = formula.indicaciones && formula.indicaciones.toLowerCase().includes(busquedaLower);

      const medicamentoCumple = formula.medicamento.nombre && formula.medicamento.nombre.toLowerCase().includes(busquedaLower);

      const presentacionCumple = formula.medicamento.presentacion && formula.medicamento.presentacion.toLowerCase().includes(busquedaLower);

      const nombresCumple = formula.cita.paciente.nombres && formula.cita.paciente.nombres.toLowerCase().includes(busquedaLower);

      const apellidosCumple = formula.cita.paciente.apellidos && formula.cita.paciente.apellidos.toLowerCase().includes(busquedaLower);

      const fechaCitaCumple = formula.cita.fechaHora && formula.cita.fechaHora.toString().includes(busquedaLower);

      const documentoCumple = formula.cita.paciente.numeroDocumento && formula.cita?.paciente?.numeroDocumento.includes(busquedaLower);

      return (
        dosisCumple ||
        indicacionesCumple ||
        presentacionCumple ||
        nombresCumple ||
        apellidosCumple ||
        fechaCitaCumple ||
        documentoCumple ||
        medicamentoCumple
      );
    });
  }

  /**
   * Método para contar los caracteres del campo indicaciones
   */
  onIndicacionesChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const valor = target.value;

    // Limitar a 500 caracteres
    if (valor.length <= this.LIMITE_CARACTERES) {
      this.indicaciones = valor;
      this.contadorCaracteres = valor.length;
    } else {
      // Si excede el límite, cortar el texto
      this.indicaciones = valor.substring(0, this.LIMITE_CARACTERES);
      target.value = this.indicaciones;
      this.contadorCaracteres = this.LIMITE_CARACTERES;
    }

    // Actualizar el FormControl
    this.form.get('indicaciones')?.setValue(this.indicaciones);
  }

  /**
   * Método para inicializar el contador cuando se carga una fórmula existente
   */
  inicializarContador(indicaciones: string) {
    if (indicaciones) {
      this.indicaciones = indicaciones;
      this.contadorCaracteres = indicaciones.length;
    } else {
      this.indicaciones = '';
      this.contadorCaracteres = 0;
    }
  }

  buscarPaciente() {
    this.titleSpinner = 'Buscando paciente...';
    this.spinner.show();
    this.pacienteService.buscarPacientePorDocumento(this.documentoPaciente).subscribe({
      next: (paciente) => {
        this.spinner.hide();
        if (paciente) {
          Swal.fire('Éxito', 'Citas del paciente listadas correctamente', 'success');
          // Busco las citas por paciente id
          this.citaService.listarCitasPorPaciente(paciente.id).subscribe({
            next: (citas) => {
              this.citasList = citas;
              if (!citas || citas.length == 0) {
                console.warn('El paciente no tiene citas asociadas.');
                Swal.fire('Advertencia', 'El paciente no tiene citas asociadas.', 'warning');
              }
              if (this.modoFormulario) {
                console.log('Entro poque es edicion');
                this.citaSelected = this.citasList.find((cita) => cita.id === this.formulaSelected.cita.id);
                this.form.get('citaId')?.setValue(this.citaSelected?.id || '');
              }
            },
            error: (err) => {
              console.error('Error al listar las citas del paciente:', err);
            }
          });
        } else {
          Swal.fire('Advertencia', 'Paciente no encontrado', 'warning');
        }
      },
      error: () => {
        this.spinner.hide();
        Swal.fire('Advertencia', 'Paciente no encontrado', 'warning');
      }
    });
  }

  guardarFormula() {
    this.titleSpinner = this.modoFormulario === 'C' ? 'Creando fórmula...' : 'Actualizando fórmula...';
    this.spinner.show();
    if (this.citaSelected === undefined) {
      this.spinner.hide();
      Swal.fire('Advertencia', 'Debe seleccionar la cita', 'warning');
    }

    if (this.modoFormulario === 'C') {
      this.form.get('citaId')?.setValue(this.citaSelected.id);
      this.formulaService.guardarFormula(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.message, 'success');
          this.listarRecetas();
          this.closeModal();
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error al guardar la fórmula:', err);
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al guardar la fórmula.', 'error');
        }
      });
    } else {
      // Modo Edición
      const formulaActualizada = { ...this.formulaSelected, ...this.form.getRawValue() };
      formulaActualizada.cita = this.citaSelected;
      this.formulaService.actualizarFormula(formulaActualizada).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.message, 'success');
          this.listarRecetas();
          this.closeModal();
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error al actualizar la fórmula:', err);
          Swal.fire('Error', err.error?.message || 'Ocurrió un error al actualizar la fórmula.', 'error');
        }
      }); 
    }
  }
}
