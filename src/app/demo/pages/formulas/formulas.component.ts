import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { Formula } from './models/formula';
import { FormulaService } from './service/formulas.service';

@Component({
  selector: 'app-formulas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulas.component.html',
  styleUrls: ['./formulas.component.scss']
})
export class FormulasComponent implements OnInit {
  formulas: Formula[] = [];
  form!: FormGroup;
  modalInstance: Modal | null = null;
  tituloModal = '';
  tituloBoton = '';
  modoFormulario = '';
  cargando = false;

  constructor(private fb: FormBuilder, private formulaService: FormulaService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      citaId: [null, Validators.required],
      medicamentoId: [null, Validators.required],
      dosis: ['', Validators.required],
      indicaciones: ['', Validators.required]
    });
    this.listarFormulas();
  }

  get f() {
    return this.form.controls;
  }

  listarFormulas() {
    this.cargando = true;
    this.formulaService.listarFormulas().subscribe({
      next: (data) => {
        this.formulas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar las fórmulas médicas', 'error');
      }
    });
  }

  abrirNuevaFormula() {
    this.modoFormulario = 'C';
    this.tituloModal = 'Nueva Fórmula Médica';
    this.tituloBoton = 'Guardar';
    this.form.reset();
    const modalEl = document.getElementById('modalFormula');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  abrirEditarFormula(formula: Formula) {
    this.modoFormulario = 'E';
    this.tituloModal = 'Editar Fórmula Médica';
    this.tituloBoton = 'Actualizar';
    this.form.patchValue({
      id: formula.id,
      citaId: formula.cita?.id,
      medicamentoId: formula.medicamento?.id,
      dosis: formula.dosis,
      indicaciones: formula.indicaciones
    });
    const modalEl = document.getElementById('modalFormula');
    if (modalEl) {
      this.modalInstance ??= new Modal(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarFormula() {
  if (this.form.invalid) {
    Swal.fire('Atención', 'Por favor completa los campos obligatorios', 'warning');
    return;
  }

  const values = this.form.value;
  const formula: Formula = {
    id: values.id,
    cita: { id: values.citaId },
    medicamento: { id: values.medicamentoId },
    dosis: values.dosis,
    indicaciones: values.indicaciones
  };

  this.cargando = true;

  if (this.modoFormulario === 'C') {
    this.formulaService.guardarFormula(formula).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Fórmula creada correctamente', 'success');
        this.listarFormulas();
        this.closeModal();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al crear la fórmula:', err);

        if (err.status === 404) {
          Swal.fire('Advertencia', 'La cita o el medicamento no existen.', 'warning');
        } else if (err.status === 400) {
          Swal.fire('Error', 'Datos inválidos. Verifica los campos ingresados.', 'error');
        } else {
          Swal.fire('Error', 'No se pudo crear la fórmula.', 'error');
        }
      },
      complete: () => (this.cargando = false)
    });

  } else if (this.modoFormulario === 'E' && formula.id) {
    this.formulaService.actualizarFormula(formula).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Fórmula actualizada correctamente', 'success');
        this.listarFormulas();
        this.closeModal();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al actualizar la fórmula:', err);

        if (err.status === 404) {
          Swal.fire('Advertencia', 'La cita o el medicamento no existen.', 'warning');
        } else if (err.status === 400) {
          Swal.fire('Error', 'Datos inválidos. Verifica los campos ingresados.', 'error');
        } else {
          Swal.fire('Error', 'No se pudo actualizar la fórmula.', 'error');
        }
      },
      complete: () => (this.cargando = false)
    });
  }
}




  eliminarFormula(formula: Formula) {
    Swal.fire({
      title: `¿Eliminar fórmula #${formula.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && formula.id) {
        this.cargando = true;
        this.formulaService.eliminarFormula(formula.id).subscribe({
          next: () => {
            Swal.fire('Eliminada', 'Fórmula eliminada correctamente', 'success');
            this.listarFormulas();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la fórmula', 'error'),
          complete: () => (this.cargando = false)
        });
      }
    });
  }
}
