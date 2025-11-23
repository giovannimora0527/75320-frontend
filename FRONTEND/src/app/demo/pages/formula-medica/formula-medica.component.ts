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
import { timeout } from 'rxjs/operators';
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
  isLoadingFormulas = false;

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
      cantidadRecetada: [1, [Validators.required, Validators.min(1)]],
      dosis: ['', Validators.required],
      indicaciones: ['', Validators.required],
    });
  }

  cargarListas() {
    // Cargar medicamentos con fallback de 6s si no hay respuesta
    const medsFallback = setTimeout(() => {
      try { this.spinner.hide('pacmanSpinner'); } catch { /* noop */ }
      Swal.fire('Advertencia', 'No se recibió respuesta del servidor al cargar medicamentos. Intente nuevamente más tarde.', 'warning');
    }, 6000);

    this.medicamentoService.listarMedicamentos().subscribe({
      next: data => {
        clearTimeout(medsFallback);
        this.medicamentos = data;
      },
      error: (err) => {
        clearTimeout(medsFallback);
        Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
      }
    });

    // Cargar citas con su propio fallback (silencioso)
    const citasFallback = setTimeout(() => {
      try { this.spinner.hide('pacmanSpinner'); } catch { /* noop */ }
      console.warn('No se recibió respuesta para cargar citas en 6s');
    }, 6000);

    this.citaService.listarCitas().subscribe({
      next: data => {
        clearTimeout(citasFallback);
        this.citas = data;
      },
      error: () => {
        clearTimeout(citasFallback);
        Swal.fire('Error', 'No se pudieron cargar las citas', 'error');
      }
    });
  }

  listarFormulas() {
    // Mostrar spinner y usar timeout de 6s para cancelar la petición si no responde
    this.isLoadingFormulas = true;
    this.spinner.show('pacmanSpinner');

    this.formulaService.listarFormulas().pipe(
      timeout(6000)
    ).subscribe({
      next: data => {
        this.isLoadingFormulas = false;
        // Agregar retraso de 1 segundo antes de ocultar el spinner
        setTimeout(() => {
          this.formulas = data;
          this.spinner.hide('pacmanSpinner');
        }, 1000); // 1000 ms = 1 segundo
      },
      error: (err) => {
        this.isLoadingFormulas = false;
        // Ocultar el spinner incluso en caso de error, con retraso
        setTimeout(() => {
          try { this.spinner.hide('pacmanSpinner'); } catch { /* noop */ }
          if (err && err.name === 'TimeoutError') {
            Swal.fire('Advertencia', 'No se recibió respuesta del servidor al cargar fórmulas. Intente nuevamente más tarde.', 'warning');
          } else {
            Swal.fire('Error', 'No se pudieron cargar las fórmulas', 'error');
          }
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
      cantidadRecetada: formula.cantidadRecetada,
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
      cantidadRecetada: Number(raw.cantidadRecetada),
      dosis: raw.dosis?.trim(),
      indicaciones: raw.indicaciones?.trim(),
    };

    if (!payload.citaId || !payload.medicamentoId) {
      this.mensaje = 'Seleccione una cita y un medicamento.';
      return;
    }

    // Validar disponibilidad de medicamento
    const medicamentoSeleccionado = this.medicamentos.find(m => m.id === Number(raw.medicamentoId));
    if (!medicamentoSeleccionado) {
      this.mensaje = 'El medicamento seleccionado no existe.';
      return;
    }

    if (medicamentoSeleccionado.cantidad < raw.cantidadRecetada) {
      this.mensaje = `Solo hay ${medicamentoSeleccionado.cantidad} unidades disponibles del medicamento seleccionado.`;
      return;
    }

    this.spinner.show('pacmanSpinner');

    const guardarFormula = (formula: FormulaMedica) => {
      return new Promise<RespuestaRs>((resolve, reject) => {
        if (this.modoEdicion && this.formulaEditando) {
          this.formulaService.actualizarFormula(this.formulaEditando.id!, formula).subscribe({
            next: (resp) => resolve(resp),
            error: (err) => reject(err)
          });
        } else {
          this.formulaService.guardarFormula(formula).subscribe({
            next: (resp) => resolve(resp),
            error: (err) => reject(err)
          });
        }
      });
    };

    const actualizarCantidadMedicamento = () => {
      return new Promise<void>((resolve, reject) => {
        this.medicamentoService.actualizarCantidad(Number(payload.medicamentoId), payload.cantidadRecetada).subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
      });
    };

    // Ejecutar operaciones
    guardarFormula(payload).then(respFormula => {
      return actualizarCantidadMedicamento().then(() => {
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
            text: respFormula.message || 'Fórmula guardada correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1000);
      });
    }).catch(err => {
      setTimeout(() => {
        this.spinner.hide('pacmanSpinner');
        Swal.fire('Error', err.error?.message || 'Error al procesar la operación', 'error');
      }, 1000);
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