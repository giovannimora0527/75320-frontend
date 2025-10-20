import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  modalInstance: Modal | null = null;
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  titleModal: string = '';
  titleBoton: string = '';
  modoFormulario: string = '';
  pacienteSeleccionado!: Paciente;

  form: FormGroup;

  constructor(private fb: FormBuilder, private pacienteService: PacienteService) {
    this.form = this.fb.group({
      usuario_id: ['1'], // por ahora fijo, se puede reemplazar
      tipo_documento: ['', Validators.required],
      numero_documento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
    this.listarPacientes();
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.pacientesFiltrados = data;
      },
      error: (err) => console.error('Error al listar pacientes:', err)
    });
  }

  abrirNuevoPaciente() {
    this.modoFormulario = 'C';
    this.titleModal = 'Nuevo Paciente';
    this.titleBoton = 'Guardar Paciente';
    this.form.reset();
    this.openModal();
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.modoFormulario = 'E';
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar Paciente';
    this.form.patchValue(paciente);
    this.pacienteSeleccionado = paciente;
    this.openModal();
  }

  guardarPaciente() {
    if (this.form.valid) {
      const paciente = this.form.getRawValue() as Paciente;

      const operacion = this.modoFormulario === 'C'
        ? this.pacienteService.guardarPaciente(paciente)
        : this.pacienteService.actualizarPaciente(paciente);

      operacion.subscribe({
        next: (resp) => {
          Swal.fire('Éxito', resp.message, 'success');
          this.closeModal();
          this.listarPacientes();
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'Error en el servidor', 'error');
        }
      });
    }
  }

  filtrar(event: any, campo: keyof Paciente) {
    const valor = event.target.value.toLowerCase();
    this.pacientesFiltrados = this.pacientes.filter(p =>
      p[campo]?.toString().toLowerCase().includes(valor)
    );
  }

  openModal() {
    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) this.modalInstance.hide();
  }
}
