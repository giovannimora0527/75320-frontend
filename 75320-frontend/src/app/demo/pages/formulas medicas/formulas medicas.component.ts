import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';
import { PacienteService } from '../paciente/service/paciente.service';
import { MedicoService } from '../medico/service/medico.service';
import { FormulaMedicaService } from './service/formula-medica.service';

@Component({
  selector: 'app-formula-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulas medicas.component.html',
  styleUrls: ['./formulas medicas.component.scss']
})
export class FormulaMedicaComponent implements OnInit {
  modalInstance: Modal | null = null;
  formulasMedicas: any[] = [];
  pacientes: any[] = [];
  medicos: any[] = [];
  form: FormGroup;

  constructor(
    private formulaService: FormulaMedicaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      pacienteId: ['', Validators.required],
      medicoId: ['', Validators.required],
      medicamento: ['', Validators.required],
      indicaciones: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarFormulas();
    this.listarPacientes();
    this.listarMedicos();
  }

  listarFormulas(): void {
    this.formulaService.getFormulas().subscribe({
      next: (data) => (this.formulasMedicas = data),
      error: (err) => console.error('❌ Error al listar fórmulas médicas:', err)
    });
  }

  listarPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener pacientes:', err);
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
      }
    });
  }

  listarMedicos(): void {
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        this.medicos = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener médicos:', err);
        Swal.fire('Error', 'No se pudieron cargar los médicos', 'error');
      }
    });
  }

  abrirNuevaFormula(): void {
    this.form.reset();
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    } else {
      Swal.fire('Error', 'No se encontró el modal de creación de fórmulas médicas.', 'error');
    }
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  guardarFormula(): void {
    if (!this.form.valid) {
      Swal.fire('Atención', 'Por favor complete todos los campos del formulario', 'warning');
      return;
    }

    const formData = this.form.value;

    // ✅ Construir el JSON que espera tu backend
    const receta = {
      descripcion: `${formData.medicamento} - ${formData.indicaciones}`,
      medicamento: formData.medicamento,
      indicaciones: formData.indicaciones,
      cita: { id: 5 } // ⚠️ Cambia este ID según tu lógica de citas reales
    };

    console.log('📤 Enviando receta al backend:', receta);

    this.formulaService.guardarFormula(receta).subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa del backend:', response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Fórmula médica guardada correctamente'
        });
        this.listarFormulas();
        this.closeModal();
      },
      error: (err) => {
        // ⚠️ Manejar correctamente el código 201 (éxito con "falso error")
        if (err.status === 201) {
          console.warn('⚠️ Respuesta 201 tratada como éxito:', err);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Fórmula médica guardada correctamente'
          });
          this.listarFormulas();
          this.closeModal();
          return;
        }

        console.error('❌ Error al guardar fórmula médica:', err);

        let mensaje = 'No se pudo guardar la fórmula médica.';
        if (err.error) {
          if (typeof err.error === 'string') mensaje = err.error;
          else if (err.error.message) mensaje = err.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje
        });
      }
    });
  }
}








































