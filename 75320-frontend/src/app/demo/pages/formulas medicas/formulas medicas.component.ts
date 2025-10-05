import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { FormulaMedicaService } from './service/formula medica.service';

@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulas medicas.component.html',
  styleUrls: ['./formulas medicas.component.scss']
})
export class FormulaMedicaComponent {
  modalInstance: Modal | null = null;
  formulasMedicas: any[] = [];
  form: FormGroup;

  constructor(
    private formulaService: FormulaMedicaService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      paciente: ['', Validators.required],
      medico: ['', Validators.required],
      medicamento: ['', Validators.required],
      indicaciones: ['', Validators.required]
    });

    this.listarFormulas();
  }

  // ✅ Listar las fórmulas médicas
  listarFormulas() {
    this.formulaService.getFormulas().subscribe({
      next: (data) => (this.formulasMedicas = data),
      error: (err) => console.error('Error al listar fórmulas médicas:', err)
    });
  }

  // ✅ Abrir el modal para crear una nueva fórmula
  abrirNuevaFormula() {
    this.form.reset();
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    } else {
      Swal.fire('Error', 'No se encontró el modal de creación de fórmulas médicas.', 'error');
    }
  }

  // ✅ Cerrar el modal
  closeModal() {
    this.modalInstance?.hide();
  }

  // ✅ Guardar nueva fórmula médica
  guardarFormula() {
    if (this.form.valid) {
      this.formulaService.guardarFormula(this.form.value).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Fórmula médica guardada correctamente', 'success');
          this.listarFormulas();
          this.closeModal();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo guardar la fórmula médica', 'error');
        }
      });
    } else {
      Swal.fire('Atención', 'Por favor complete todos los campos del formulario', 'warning');
    }
  }
}
