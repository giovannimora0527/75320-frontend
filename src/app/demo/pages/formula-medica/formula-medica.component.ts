import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormulaMedicaService } from './service/formula-medica.service';
import { FormulaMedica } from './models/formula-medica';
import { MedicamentoService } from '../medicamento/service/medicamento.service';
import { CitaService } from '../cita/service/cita.service';
import { Medicamento } from '../medicamento/models/medicamento';
import { Cita } from '../cita/models/cita';
import Modal from 'bootstrap/js/dist/modal';
import { RespuestaRs } from 'src/app/models/respuesta';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula-medica.component.html',
  styleUrls: ['./formula-medica.component.scss']
})
export class FormulaMedicaComponent implements OnInit {
  form!: FormGroup;
  formulas: FormulaMedica[] = [];
  medicamentos: Medicamento[] = [];
  citas: Cita[] = [];
  mensaje: string = '';

  modoEdicion = false;
  formulaEditando: FormulaMedica | null = null;
  modalInstance: Modal | null = null;

  constructor(
    private fb: FormBuilder,
    private formulaService: FormulaMedicaService,
    private medicamentoService: MedicamentoService,
    private citaService: CitaService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarListas();
    this.listarFormulas();
  }

  crearFormulario() {
    this.form = this.fb.group({
      citaId: ['', Validators.required],
      medicamentoId: ['', Validators.required],
      dosis: ['', Validators.required],
      indicaciones: ['', Validators.required],
    });
  }

  cargarListas() {
    this.medicamentoService.listarMedicamentos().subscribe({
      next: data => this.medicamentos = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error')
    });
    this.citaService.listarCitas().subscribe({
      next: data => this.citas = data,
      error: () => Swal.fire('Error', 'No se pudieron cargar las citas', 'error')
    });
  }

  listarFormulas() {
    this.spinner.show('pacmanSpinner');
    this.formulaService.listarFormulas().subscribe({
      next: data => {
        // Agregar retraso de 1 segundo antes de ocultar el spinner
        setTimeout(() => {
          this.formulas = data;
          this.spinner.hide('pacmanSpinner');
        }, 1000); // 1000 ms = 1 segundo
      },
      error: () => {
        // Ocultar el spinner incluso en caso de error, con retraso
        setTimeout(() => {
          this.spinner.hide('pacmanSpinner');
          Swal.fire('Error', 'No se pudieron cargar las fórmulas', 'error');
        }, 1000);
      }
    });
  }

  abrirModalCrear() {
    this.modoEdicion = false;
    this.form.reset();
    this.mensaje = '';
    const modalElement = document.getElementById('modalFormula') as HTMLElement;
    this.modalInstance = new Modal(modalElement);
    this.modalInstance.show();
  }

  abrirModalEditar(formula: FormulaMedica) {
    this.modoEdicion = true;
    this.formulaEditando = formula;
    this.mensaje = '';
    this.form.patchValue({
      citaId: formula.citaId,
      medicamentoId: formula.medicamentoId,
      dosis: formula.dosis,
      indicaciones: formula.indicaciones
    });
    const modalElement = document.getElementById('modalFormula') as HTMLElement;
    this.modalInstance = new Modal(modalElement);
    this.modalInstance.show();
  }

  guardarFormula() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const raw = this.form.value;
    const payload: FormulaMedica = {
      citaId: Number(raw.citaId),
      medicamentoId: Number(raw.medicamentoId),
      dosis: raw.dosis?.trim(),
      indicaciones: raw.indicaciones?.trim(),
    };

    if (!payload.citaId || !payload.medicamentoId) {
      this.mensaje = 'Seleccione una cita y un medicamento.';
      return;
    }

    this.spinner.show('pacmanSpinner');

    if (this.modoEdicion && this.formulaEditando) {
      this.formulaService.actualizarFormula(this.formulaEditando.id!, payload).subscribe({
        next: (resp: RespuestaRs) => {
          // Agregar retraso de 1 segundo antes de ocultar el spinner
          setTimeout(() => {
            this.spinner.hide('pacmanSpinner');
            this.listarFormulas();
            this.form.reset();
            this.modalInstance?.hide();
            this.modoEdicion = false;
            this.formulaEditando = null;
            this.mensaje = '';
            Swal.fire({
              title: '¡Éxito!',
              text: resp.message || 'Fórmula actualizada correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }, 1000);
        },
        error: (err) => {
          // Ocultar el spinner incluso en caso de error, con retraso
          setTimeout(() => {
            this.spinner.hide('pacmanSpinner');
            Swal.fire('Error', err.error?.message || 'Error al actualizar la fórmula médica', 'error');
          }, 1000);
        }
      });
      return;
    }

    this.formulaService.guardarFormula(payload).subscribe({
      next: (resp: RespuestaRs) => {
        // Agregar retraso de 1 segundo antes de ocultar el spinner
        setTimeout(() => {
          this.spinner.hide('pacmanSpinner');
          this.listarFormulas();
          this.form.reset();
          this.modalInstance?.hide();
          this.mensaje = '';
          Swal.fire({
            title: '¡Éxito!',
            text: resp.message || 'Fórmula guardada correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1000);
      },
      error: (err) => {
        // Ocultar el spinner incluso en caso de error, con retraso
        setTimeout(() => {
          this.spinner.hide('pacmanSpinner');
          Swal.fire('Error', err.error?.message || 'Error al guardar la fórmula médica', 'error');
        }, 1000);
      }
    });
  }

  eliminarFormula(formula: FormulaMedica) {
    Swal.fire({
      title: `¿Desea eliminar la fórmula #${formula.id}?`,
      text: `El medicamento asociado es: ${formula.medicamentoId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.spinner.show('pacmanSpinner');
        this.formulaService.eliminarFormula(formula.id!).subscribe({
          next: () => {
            // Agregar retraso de 1 segundo antes de ocultar el spinner
            setTimeout(() => {
              this.spinner.hide('pacmanSpinner');
              this.listarFormulas();
              Swal.fire({
                title: 'Eliminado',
                text: 'La fórmula fue eliminada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            }, 1000);
          },
          error: () => {
            // Ocultar el spinner incluso en caso de error, con retraso
            setTimeout(() => {
              this.spinner.hide('pacmanSpinner');
              Swal.fire('Error', 'No se pudo eliminar la fórmula médica', 'error');
            }, 1000);
          }
        });
      }
    });
  }
}