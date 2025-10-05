import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitaService } from './service/cita.service';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent {
  modalInstance: Modal | null = null;
  citas: any[] = []; // ✅ Inicialización correcta
  form: FormGroup;

  constructor(
    private readonly citaService: CitaService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      paciente: ['', Validators.required],
      medico: ['', Validators.required],
      motivo: ['']
    });
    this.listarCitas();
  }

  listarCitas() {
    this.citaService.getCitas().subscribe({
      next: (data) => {
        this.citas = data; // ✅ aquí data debe ser un array
        console.log('Citas cargadas:', this.citas);
      },
      error: (error) => {
        console.error('Error al listar citas:', error);
      }
    });
  }

  abrirNuevaCita() {
    const modalElement = document.getElementById('modalCrearCita');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    } else {
      Swal.fire('Error', 'No se encontró el modal de creación de citas.', 'error');
    }
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }

  guardarCita() {
    if (this.form.valid) {
      this.citaService.guardarCita(this.form.value).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Cita guardada correctamente', 'success');
          this.closeModal();
          this.listarCitas();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo guardar la cita', 'error');
          console.error(err);
        }
      });
    } else {
      Swal.fire('Formulario incompleto', 'Por favor complete los campos obligatorios.', 'warning');
    }
  }
}

